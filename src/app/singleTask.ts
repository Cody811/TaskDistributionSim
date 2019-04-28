export class SingleTask {
  public distribution: string;
  public skew: number;
  public points: number[];
  public confidence: number;
  public title: string;
  public id: number;

  public randomize: () => {};


  constructor() {
    this.distribution = 'Normal';
    this.skew = 0;
    this.confidence = 0.5;
    this.points = [3, 10];
    this.title = 'Blank Task';
    this.id = 0;

    this.randomize = (): any => {
      this.distribution = Math.random() > 0.5 ? 'Normal' : 'Binomial';
      this.skew = Math.round((Math.random() - 0.5) * 100) / 100 ;
      this.points = this.distribution === 'Normal' ? [1, 5] : [1, 5, 9, 12];
      this.confidence = Math.random();
      this.title = Math.random() > 0.5 ? 'Make app' : 'Do CSS';
      this.id = Math.floor(Math.random() * 10000);

    };
  }
}
