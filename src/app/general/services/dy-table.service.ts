import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, first, of, catchError, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { DyButton } from '../interfaces/dy-button';
import { InfoTable } from '../interfaces/info-table';

@Injectable({
  providedIn: 'root',
})
export class DyTableService {
  constructor(private notiSrv: ToastService) { }
  getInstObs(
    instObs$: Observable<any>,
    notAllowed: string[],
    additional?: { attribute: string; dynamic: string; dataType: string }[]
  ): Observable<any> {
    if (!additional) {
      additional = [];
    }
    instObs$ = instObs$.pipe(
      first(),
      switchMap((res: any) => {
        let body: {
          loading: boolean;
          data: any[];
          columns: any[];
        };
        if (res['data']) {
          if (res['data']['model'].length > 0) {
            const allKeys = res['data']['model'][0];
            const allowedKeys = Object.keys(allKeys)
              .filter((key) => !notAllowed.includes(key))
              .reduce((obj: any, key) => {
                obj[key] = allKeys[key];
                return obj;
              }, {});
            const arr = [...res['data']['type'], ...additional];
            body = {
              loading: false,
              data: res['data']['model'] as any[],
              columns: this.getSchema(allowedKeys, arr, [
                'HeightImplemented',
                ...(res['data']['type'] as any[]),
              ]),
            };
            return of(body);
          } else {
            return of({
              loading: false,
              data: [],
              columns: [],
            });
          }
        } else {
          this.notiSrv.showError(res.message, 'Error');
          return of(null);
        }
      }),
      catchError(error => of({
        loading: false,
        data: [],
        columns: [],
      })
      )
    );
    return instObs$;
  }
  getInstObsSideArmBranching(
    instObs$: Observable<any>,
    NeededColumn: any[]
  ): Observable<any> {
    instObs$ = instObs$.pipe(
      switchMap((res) => {
        if (res && res.length > 0) {
          return of({
            loading: false,
            data: res,
            columns: NeededColumn,
          });
        } else {
          return of({
            loading: false,
            data: [],
            columns: [],
          });
        }
      }),
      catchError(error => of({
        loading: false,
        data: [],
        columns: [],
      })
      )
    );
    return instObs$;
  }
  getLibObs(
    instObs$: Observable<any>,
    notAllowed: string[],
    ToggleColumn: string[] = [],
    additional?: { attribute: string; dynamic: string; dataType: string }[]
  ) {
    if (!additional) {
      additional = [];
    }
    instObs$ = instObs$.pipe(
      switchMap((res) => {
        if (res['data'] && res['data']['model']) {
          let body: {
            loading: boolean;
            data: any[];
            columns: any[];
          };
          if (res['data']['model'].length > 0) {
            const notAllowed = ['Id', , 'Deleted'];
            const allKeys = res['data']['model'][0];
            const allowedKeys = Object.keys(allKeys)
              .filter((key) => !notAllowed.includes(key))
              .reduce((obj: any, key) => {
                obj[key] = allKeys[key];
                return obj;
              }, {});
            const arr = [...res['data']['type'], ...additional];
            const columns = this.getSchema(allowedKeys, arr, [
              'HeightImplemented',
              ...(res['data']['type'] as any[]).filter(
                (x) => x.dynamic === null
              ),
            ]).map((col) => {
              col = ToggleColumn.includes(col.field)
                ? (col = {
                  HeaderType: 'Toggle',
                  field: col.field,
                  header: col.header,
                })
                : col;
              return col;
            });
            ToggleColumn.forEach((el) => {
              const elIndex = columns.findIndex((col) => col.field === el);
              if (elIndex > -1) {
                const element = columns.splice(elIndex, 1)[0];
                columns.unshift(element);
              }
            });
            body = {
              loading: false,
              data: res['data']['model'] as any[],
              columns: columns,
            };
            return of(body);
          } else {
            return of({
              loading: false,
              data: [],
              columns: [],
            });
          }
        } else {
          return of({
            loading: true,
            data: [],
            columns: [],
          });
        }
      }),
      catchError(error => of({
        loading: false,
        data: [],
        columns: [],
      })
      )
    );
    return instObs$;
  }
  getObsList(
    instObsList$: Observable<any>,
    notAllowed: string[],
    ToggleColumn: string[] = []
  ) {
    instObsList$ = instObsList$.pipe(
      switchMap((res) => {
        if (res['data'] && res['data']['model']) {
          let body: {
            loading: boolean;
            data: any[];
            columns: any[];
          };
          if (res['data']['model'].length > 0) {
            const allKeys = res['data']['model'][0];
            const allowedKeys = Object.keys(allKeys)
              .filter((key: string) => !notAllowed.includes(key))
              .reduce((obj: any, key) => {
                obj[key] = allKeys[key];
                return obj;
              }, {});
            const columns = this.getSchema(allowedKeys, res['data']['type'], [
              'HeightImplemented',
              ...(res['data']['type'] as any[]).filter(
                (x) => x.dynamic === null
              ),
            ]).map((col) => {
              col = ToggleColumn.includes(col.field)
                ? (col = {
                  HeaderType: 'Toggle',
                  field: col.field,
                  header: col.header,
                })
                : col;
              return col;
            });
            ToggleColumn.forEach((el) => {
              const elIndex = columns.findIndex((col) => col.field === el);
              if (elIndex > -1) {
                const element = columns.splice(elIndex, 1)[0];
                columns.unshift(element);
              }
            });
            body = {
              loading: false,
              data: (res['data']['model'] as any[]).map((item) => {
                (res['data']['type'] as any[])
                  .filter((type) => type.dataType === 'DateTime')
                  .forEach(
                    (type) =>
                    (item[type.dynamic ? type.dynamic : type.attribute] =
                      new Date(
                        item[type.dynamic ? type.dynamic : type.attribute]
                      ))
                  );
                return item;
              }),
              columns: columns,
            };
            return of(body);
          } else {
            return of({
              loading: false,
              data: [],
              columns: [],
            });
          }
        } else {
          return of({
            loading: true,
            data: [],
            columns: [],
          });
        }
      }),
      catchError(error => of({
        loading: false,
        data: [],
        columns: [],
      })
      )
    );
    return instObsList$;
  }
  getSchema(
    allowedKeys: any,
    types: { attribute: string; dynamic: string; dataType: string }[],
    notForeignKey: string[]
  ): any[] {
    let schema: any[] = [];
    types.forEach((element) => {
      const key = element.attribute ? element.attribute : element.dynamic;
      const all = Object.keys(allowedKeys) as string[];
      let isInclude = all.includes(key);
      types;
      if (key) {
        if (isInclude || notForeignKey.includes(key)) {
          schema.push({
            header: key,
            field: key,
            HeaderType: element.dataType,
          });
        } else if (
          (key as string).toLowerCase().endsWith('id') &&
          key.toLowerCase() !== 'id' &&
          !notForeignKey.includes(key)
        ) {
          const endKey = (key as string).toUpperCase().slice(0, key.length - 2);
          isInclude = all.includes(endKey);
          if (isInclude) {
            schema.push({
              header: key,
              field: endKey,
              HeaderType: element.dataType,
            });
          }
        }
      }
    });
    return schema;
  }
  getStandardButtons(deleteFunc?: (rowData: any) => void, editFunc?: (rowData: any) => void, displayFunc?: (rowData: any) => void) {
    const Buttons: DyButton[] = [];
    if (deleteFunc) {
      Buttons.push({
        isShow: true,
        tooltip: 'Delete Item',
        icon: 'pi pi-trash',
        key: 'Delete',
        severity: 'secondary',
        command: (rowData) => {
          deleteFunc(rowData);
        }
      })
    }
    if (editFunc) {
      Buttons.push({
        isShow: true,
        tooltip: 'Edit Item',
        icon: 'pi pi-pencil',
        key: 'Edit',
        severity: 'secondary',
        command: (rowData) => {
          editFunc(rowData);
        }
      })
    }
    if (displayFunc) {
      Buttons.push({
        isShow: true,
        tooltip: 'Item Details',
        icon: 'pi pi-eye',
        key: 'Details',
        severity: 'secondary',
        command: (rowData) => {
          displayFunc(rowData);
        }
      })
    }
    return Buttons;
  }
  getStandardCaptionButtons(addFunc?: () => void) {
    const Buttons: DyButton[] = [];
    if (addFunc) {
      Buttons.push({
        isShow: true,
        tooltip: 'Add New Item',
        icon: 'pi pi-plus',
        key: 'Add',
        severity: 'primary',
        command: () => {
          addFunc();
        }
      },)
    }
    return Buttons;
  }
  getStandardInfo(
    deleteFunc?: (rowData: any) => void,
    editFunc?: (rowData: any) => void,
    displayFunc?: (rowData: any) => void,
    addFunc?: () => void): InfoTable {
    const info: InfoTable = {
      getSub$: new ReplaySubject(),
      get$: new Observable(),
      captionButton: [],
      Buttons: [],
    };
    info.Buttons = this.getStandardButtons(deleteFunc, editFunc, displayFunc);
    info.captionButton = this.getStandardCaptionButtons(addFunc);
    return info;
  }
}
