export class Options {

    private static _instance: Options = new Options();
    constructor() {
        if (Options._instance) {
            throw new Error("Error: Instantiation failed: Use Options.getInstance() instead of new.");
        }
        Options._instance = this;
    }

    public static getInstance(): Options {
        return Options._instance;
    }

    //todo:  import color into here?
    public options = {
        HighlightSelectedCell: true,
        HighlightSimilarNumbers: true,
        HighlightSelectedRowsAndColumns: true,
        HighlightCompletedRowsAndColumns: true,
        HighlightCompletedGroups: true,
        HighlightIncorrectEntry: true,
        HighlightCompletedNumbers: true
    }

    public color = {
        bad: "{background: red} ",
        good: "{background: lightgreen} ",
        highlight: "{background: LightYellow} ",
        highlightRed: "{background: orange} ",
        selected: "{background:yellow}"
    }
}
