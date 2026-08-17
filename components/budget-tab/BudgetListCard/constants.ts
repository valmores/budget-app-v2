import { WithSpringConfig } from "react-native-reanimated";

export const SWIPE_THRESHOLD = 60;
export const ACTION_WIDTH = 72;
export const SPRING_CONFIG: WithSpringConfig = {
    damping: 20,
    stiffness: 200,
    mass: 0.8,
};
