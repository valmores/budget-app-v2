import { db } from "@/lib/firebase";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import {
    Timestamp,
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    writeBatch
} from "firebase/firestore";
import { useEffect, useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts a Firestore Timestamp (or any value) to a display string.
 * e.g. Timestamp → "Jun 30, 2026"
 */
export function formatTimestamp(ts: Timestamp | string | undefined): string {
    if (!ts) return "";
    if (typeof ts === "string") return ts;
    const date = ts.toDate();
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Builds the nested BudgetPeriod tree from two flat Firestore lists.
 */
function buildTree(
    periods: BudgetPeriod[],
    nodes: BudgetNode[]
): BudgetPeriod[] {
    // Index nodes by id for fast lookup
    const nodeMap = new Map<string, BudgetNode>(
        nodes.map((n) => [n.id, { ...n, subBudgets: [] }])
    );

    // Attach children to their parents
    for (const node of nodes) {
        if (node.parentId !== null) {
            const parent = nodeMap.get(node.parentId);
            if (parent) {
                parent.subBudgets.push(nodeMap.get(node.id)!);
            }
        }
    }

    // Sort subBudgets by order
    for (const node of nodeMap.values()) {
        node.subBudgets.sort((a, b) => a.order - b.order);
    }

    // Attach root-level nodes to their periods
    return periods.map((period) => {
        const rootChildren = nodes
            .filter((n) => n.periodId === period.id && n.parentId === null)
            .map((n) => nodeMap.get(n.id)!)
            .sort((a, b) => a.order - b.order);
        return { ...period, subBudgets: rootChildren };
    });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBudgets() {
    const [budgets, setBudgets] = useState<BudgetPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hold the latest flat lists so we can re-build the tree when either changes
    const [rawPeriods, setRawPeriods] = useState<BudgetPeriod[]>([]);
    const [rawNodes, setRawNodes] = useState<BudgetNode[]>([]);

    // ── Real-time listener: budgetPeriods ─────────────────────────────────────
    useEffect(() => {
        const q = query(
            collection(db, "budgetPeriods"),
            orderBy("order", "asc")
        );
        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const periods: BudgetPeriod[] = snap.docs.map((d) => {
                    const data = d.data();
                    return {
                        id: d.id,
                        title: data.title,
                        income: data.income,
                        date: formatTimestamp(data.date),
                        added_by: data.added_by,
                        order: data.order ?? 0,
                        createdAt: data.createdAt,
                        subBudgets: [], // filled by buildTree
                    } as BudgetPeriod;
                });
                setTimeout(() => {
                    setRawPeriods(periods);
                    setLoading(false);
                }, 600);
            },
            (err) => {
                console.error("budgetPeriods listener error:", err);
                setTimeout(() => {
                    setError(err.message);
                    setLoading(false);
                }, 600);
            }
        );
        return unsubscribe;
    }, []);

    // ── Real-time listener: budgetNodes ───────────────────────────────────────
    useEffect(() => {
        const q = query(
            collection(db, "budgetNodes"),
            orderBy("order", "asc")
        );
        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const nodes: BudgetNode[] = snap.docs.map((d) => {
                    const data = d.data();
                    return {
                        id: d.id,
                        title: data.title,
                        spent: data.spent,
                        date: formatTimestamp(data.date),
                        added_by: data.added_by,
                        periodId: data.periodId,
                        parentId: data.parentId ?? null,
                        order: data.order ?? 0,
                        createdAt: data.createdAt,
                        subBudgets: [], // filled by buildTree
                    } as BudgetNode;
                });
                setRawNodes(nodes);
            },
            (err) => {
                console.error("budgetNodes listener error:", err);
                setError(err.message);
            }
        );
        return unsubscribe;
    }, []);

    // ── Rebuild tree whenever raw data changes ────────────────────────────────
    useEffect(() => {
        setBudgets(buildTree(rawPeriods, rawNodes));
    }, [rawPeriods, rawNodes]);

    // ─── CRUD ──────────────────────────────────────────────────────────────────

    /**
     * Add a new top-level BudgetPeriod.
     */
    const addBudgetPeriod = async (data: {
        title: string;
        income: number;
        date: Timestamp;
        added_by: string;
    }) => {
        await addDoc(collection(db, "budgetPeriods"), {
            ...data,
            order: rawPeriods.length, // append to end
            createdAt: Timestamp.now(),
        });
    };

    /**
     * Add a new BudgetNode under a period or another node.
     * @param parentId  Firestore id of the parent node, or null if direct child of period
     * @param periodId  Firestore id of the root BudgetPeriod
     */
    const addBudgetNode = async (
        data: {
            title: string;
            spent?: number;
            date: Timestamp;
            added_by: string;
        },
        parentId: string | null,
        periodId: string
    ) => {
        // Count siblings to determine order
        const siblings = rawNodes.filter(
            (n) => n.periodId === periodId && n.parentId === parentId
        );
        await addDoc(collection(db, "budgetNodes"), {
            ...data,
            periodId,
            parentId,
            order: siblings.length,
            createdAt: Timestamp.now(),
        });
    };

    /**
     * Update a BudgetPeriod or BudgetNode by Firestore document id.
     */
    const updateBudget = async (
        id: string,
        updates: Partial<{ title: string; income: number; spent: number; date: Timestamp }>,
        isPeriod: boolean
    ) => {
        const colName = isPeriod ? "budgetPeriods" : "budgetNodes";
        await updateDoc(doc(db, colName, id), updates);
    };

    /**
     * Delete a BudgetPeriod (and all its descendant nodes) or a BudgetNode (and its descendants).
     */
    const deleteBudget = async (id: string, isPeriod: boolean) => {
        const batch = writeBatch(db);

        if (isPeriod) {
            // Delete the period document
            batch.delete(doc(db, "budgetPeriods", id));
            // Delete all nodes belonging to this period
            rawNodes
                .filter((n) => n.periodId === id)
                .forEach((n) => batch.delete(doc(db, "budgetNodes", n.id)));
        } else {
            // Recursively collect all descendant node ids
            const toDelete = collectDescendants(id, rawNodes);
            toDelete.forEach((nid) => batch.delete(doc(db, "budgetNodes", nid)));
        }

        await batch.commit();
    };

    return {
        budgets,
        loading,
        error,
        addBudgetPeriod,
        addBudgetNode,
        updateBudget,
        deleteBudget,
    };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Collect an id and all descendant ids from the flat nodes list. */
function collectDescendants(rootId: string, nodes: BudgetNode[]): string[] {
    const result: string[] = [rootId];
    const children = nodes.filter((n) => n.parentId === rootId);
    for (const child of children) {
        result.push(...collectDescendants(child.id, nodes));
    }
    return result;
}
