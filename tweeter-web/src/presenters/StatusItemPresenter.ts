import { User } from "tweeter-shared";

export interface StatusItemView {
    addItems: (newItems: User[]) => void
    displayErrorMessage: (message: string) => void
}

export class StatusItemPresenter {
    private _view: StatusItemView;

    protected constructor(view: StatusItemView) {
            this._view = view;
        }
}