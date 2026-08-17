import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { matchesSearch } from "../utils";

export interface UseBudgetSearchResult {
    showSearch: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchAnim: Animated.Value;
    toggleSearch: () => void;
    filteredList: (BudgetNode | BudgetPeriod)[];
}

export function useBudgetSearch(
    activeList: (BudgetNode | BudgetPeriod)[]
): UseBudgetSearchResult {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchAnim = useRef(new Animated.Value(0)).current;

    const toggleSearch = () => {
        const toValue = showSearch ? 0 : 1;
        setShowSearch(!showSearch);
        Animated.timing(searchAnim, {
            toValue,
            duration: 220,
            useNativeDriver: false,
        }).start(() => {
            if (showSearch) setSearchQuery("");
        });
    };

    const filteredList = (activeList ?? [])
        .filter((budget) => matchesSearch(budget, searchQuery))
        .sort((a, b) => b.dateMs - a.dateMs);

    return {
        showSearch,
        searchQuery,
        setSearchQuery,
        searchAnim,
        toggleSearch,
        filteredList,
    };
}
