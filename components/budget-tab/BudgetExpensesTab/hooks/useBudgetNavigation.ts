import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { useEffect, useState } from "react";
import { BackHandler } from "react-native";

export type NavStack = (BudgetNode | BudgetPeriod)[];

export interface UseBudgetNavigationResult {
    navStack: NavStack;
    setNavStack: React.Dispatch<React.SetStateAction<NavStack>>;
    handleDrillIn: (budget: BudgetNode | BudgetPeriod) => void;
    handleBack: () => void;
    currentParent: BudgetNode | BudgetPeriod | null;
    currentParentId: string | null;
    isRoot: boolean;
    sectionLabel: string;
}

export function useBudgetNavigation(): UseBudgetNavigationResult {
    const [navStack, setNavStack] = useState<NavStack>([]);

    const currentParentId =
        navStack.length > 0 ? navStack[navStack.length - 1].id : null;
    const currentParent = navStack.length > 0 ? navStack[navStack.length - 1] : null;
    const isRoot = currentParentId === null;
    const sectionLabel = navStack.length === 0 ? "All Budgets" : "Sub-Budgets";

    const handleDrillIn = (budget: BudgetNode | BudgetPeriod) => {
        setNavStack((prev) => [...prev, budget]);
    };

    const handleBack = () => {
        setNavStack((prev) => prev.slice(0, -1));
    };

    // Intercept the Android hardware/gesture back button:
    // When inside a sub-budget view, pop the nav stack instead of leaving the tab.
    useEffect(() => {
        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (navStack.length > 0) {
                    handleBack();
                    return true; // event consumed — do NOT navigate away
                }
                return false; // at root — let OS handle it normally
            }
        );
        return () => subscription.remove();
    }, [navStack.length]);

    return {
        navStack,
        setNavStack,
        handleDrillIn,
        handleBack,
        currentParent,
        currentParentId,
        isRoot,
        sectionLabel,
    };
}
