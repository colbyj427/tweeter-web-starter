export interface View {
    displayErrorMessage: (message: string) => void
}

export interface MessageView extends View{
    displayInfoMessage: (message: string,
        duration: number,
        bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void
}

export class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view
    }

    protected get view(): V {
        return this._view;
    }

    public async doFailureReportingOperation(operation: () => Promise<void>, itemDescription: string): Promise<void> {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${itemDescription} because of exception: ${error}`
            );
        }
        };
}