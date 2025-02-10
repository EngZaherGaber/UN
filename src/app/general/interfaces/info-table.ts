import { ReplaySubject, Observable } from "rxjs";
import { DyButton } from "./dy-button";

export interface InfoTable {
    getSub$: ReplaySubject<any>;
    get$: Observable<any>;
    captionButton: DyButton[];
    Buttons: DyButton[];
}
