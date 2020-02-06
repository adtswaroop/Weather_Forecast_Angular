export class Address{
    public street: string;
    public isSetStreet: boolean = false;
    public city: string;
    public isSetCity: boolean = false;
    public state: string = "Select State";
    public isSetState: boolean = false;
    public latitude: number;
    public longitude: number;
    public sealLink: string;
    public currentLocationChecked: boolean;

    constructor()
   {
       this.isSetStreet = true;
       this.isSetCity = true;
       this.isSetState = true;
       this.state = "nostate"
       this.currentLocationChecked = false;
    }
}