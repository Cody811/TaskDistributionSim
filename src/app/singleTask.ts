import {Distribution} from './distribution';

export class SingleTask {
  public distribution: string;
  public skew: number;
  public points: number[];
  public confidence: number;
  public title: string;
  public id: number;
  public actualDistro: Distribution;

  public randomize: () => {};
  public getScaleFactor: () => {};
  public getActualMin: () => {};
  public getActualMax: () => {};
  public toFixed: (value, precision) => {};

  public setConfidence: (newConfidence: number) => {};
  public setSkew: (newSkew: number) => {};
  public refreshActualDistro: () => {};

  constructor() {
    this.distribution = 'Normal';
    this.skew = 0;
    this.confidence = 0.5;
    this.points = [3, 10];
    this.title = 'Blank Task';
    this.id = 0;
    this.actualDistro = new Distribution();

    this.randomize = (): any => {
      this.distribution = Math.random() > 0.5 ? 'Normal' : 'Bimodal';
      this.skew = Math.round((Math.random() - 0.5) * 100) / 100;
      this.points = this.distribution === 'Normal' ? [1, 5] : [1, 5, 9, 12];
      this.confidence = this.toFixed((Math.random() / 2) + 0.5, 2)
      this.title = Math.random() > 0.5 ? 'Make app' : 'Do CSS';
      this.id = Math.floor(Math.random() * 100000);
    };

    this.getScaleFactor = (): number => {
      return (1 / this.confidence) - 1;
    };

    this.getActualMin = (): number => {
      return Math.floor(Math.max(this.points[0] - ((this.points[this.points.length - 1] - this.points[0]) * (this.getScaleFactor() as number) / 4), 0) * 100);
    };

    this.getActualMax = (): number => {
      return Math.floor((this.points[this.points.length - 1] + ((this.points[this.points.length - 1] - this.points[0]) * (this.getScaleFactor() as number))) * 100);
    };

    this.setConfidence = (newConfidence: number) => {
      this.confidence = newConfidence;
      this.refreshActualDistro();
      return newConfidence;
    };

    this.setSkew = (newSkew: number) => {
      this.skew = newSkew;
      this.refreshActualDistro();
      return this.skew;
    }

    this.refreshActualDistro = () => {
      this.actualDistro.clearAll();
      if(this.distribution === 'Normal') {
        this.actualDistro.addDistribution('skewnormal',
          'int',
          this.getActualMin() as number,
          this.getActualMax() as number,
          -(this.skew + 1));
      } else if (this.distribution === 'Bimodal'){
        let min = this.getActualMin();
        let mod1 = this.points[1] * 100;
        let mod2 = this.points[2] * 100;
        let max = this.getActualMax();


        this.actualDistro.addDistribution('skewnormal',
          'int',
          min as number,
          ((this.points[1] * 2) - (this.points[0] * 2)) * 100,
          -(1 + this.skew)) ;
        this.actualDistro.addDistribution('skewnormal',
          'int',
          ((this.points[2] * 2) - (this.points[3])) * 100,
          max as number,
          -(1 + this.skew));
      }
      return 1;
    };

    this.toFixed = (value, precision) => {
      const power = Math.pow(10, precision || 0);
      return String(Math.round(value * power) / power);
    };
  }
}
