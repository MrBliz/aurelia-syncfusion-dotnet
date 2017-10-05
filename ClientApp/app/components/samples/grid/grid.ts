export class Grid {
    OrdersList: any;
    public activate() {
        this.OrdersList = new ej.DataManager({ // eslint-disable-line new-cap
            url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders/',
            crossDomain: true
        });
    }
}
