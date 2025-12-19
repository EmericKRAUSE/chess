import { PieceType, ThemeName } from "./type";

export type ThemeConfig = {
    lightSquareColor:       string;
    darkSquareColor:        string;
    selectedLightColor:     string;
    selectedDarkColor:      string
    piecesThemePath:        string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
    chesscom: {
        lightSquareColor:       "#ebecd0",
        darkSquareColor:        "#739552",
        selectedLightColor:     "#f5f580",
        selectedDarkColor:      "#b9ca42",
        piecesThemePath:        "assets/pieces/chesscom"
    },
    neon: {
        lightSquareColor:       "#282828",
        darkSquareColor:        "#1C1C1C",
        selectedLightColor:     "#f5f580",
        selectedDarkColor:      "#b9ca42",
        piecesThemePath:        "assets/pieces/neon"
    }
}

export function loadTheme(themeName: ThemeName) {
    const   theme: ThemeConfig = THEMES[themeName];
    const   pieces: PieceType[] = ["pawn", "rook", "knight", "bishop", "queen", "king"];
    const   colors: ("white" | "black")[] = ["white", "black"];
    const   images: Record<"white" | "black", Record<PieceType, HTMLImageElement>> = {
        white: {} as Record<PieceType, HTMLImageElement>,
        black: {} as Record<PieceType, HTMLImageElement>,
    }
    for (const color of colors) {
        for (const piece of pieces) {
            const img = Object.assign(new Image(), { src : `${theme.piecesThemePath}/${color}/${piece}.png`});
            images[color][piece] = img;
        }
    }
    return images;
}

export const   CURRENT_THEME_NAME: ThemeName = "chesscom";
export const   CURRENT_THEME: ThemeConfig = THEMES[CURRENT_THEME_NAME];
export const   CURRENT_THEME_IMAGES = loadTheme(CURRENT_THEME_NAME);