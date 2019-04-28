export class Distribution {
  public distributions: any[];
  public uniform: Math['random'];

  public uniformFloat: (min: number, max: number) => {};
  public uniformInt: (min: number, max: number) => {};
  public normDevBoxMuller: () => {};
  public normDevLimited: () => {};
  public normDev: () => {};
  public normInt: (min: number, max: number) => {};
  public normFloat: (min: number, max: number) => {};
  public skewNormDev: (theta: number) => {};
  public skewNormInt: (min: number, max: number, theta: number) => {};
  public addDistribution: (distType: string, returnType: string, min: number, max: number, theta: number) => {};
  public addNestedDistrobution: (distro) => {};
  public next: () => {};
  public clearAll: () => {};

  constructor() {

    const self = this;

    self.distributions = [];

    /*
    * Naming convention
    * [type of distribution][type of output]
    *   Type Of Distribution
    *      Uniform - Roughly equal chance of any given output
    *      Normal  - A normal ditribution, more likely to be a middle value
    *   Type Of Return
    *       [Nothing] - (0, 1) float value
    *       Range     - A float between the min and max, passed through function
    *       Int       - An int between the min and Max, passed through function
    *
     */

    self.uniform = Math.random;

    self.uniformFloat = (min, max) => {
      return (self.uniform() * (max - min)) + min;
    };

    self.uniformInt = (min, max) => {
      return Math.floor(self.uniform() * (max - min) + min);
    };

    // (-Infinity, Infinity), but 99.99% of the time (-3.5, 3.5)
    self.normDevBoxMuller = (): number => {
      let u = 0;
      let v = 0;
      while (u === 0) { u = Math.random(); } // Converting [0,1) to (0,1)
      while (v === 0) { v = Math.random(); }
      return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    };

    // Bounds standDev to Z = (-4, 4), containing 99.992% of results
    self.normDevLimited = (): number => {
      let result: number = (self.normDevBoxMuller() as number);
      while (result < -4 || result > 4) { result = (self.normDevBoxMuller() as number); }
      return result;
    };

    // Bounds StandDev to (0, 1)
    self.normDev = () => {
      return ((self.normDevLimited() as number) + 4) / 8;
    };

    self.normInt = (min, max) => {
      return Math.floor((self.normDev() as number) * (max - min) + min);
    };

    self.normFloat = (min, max) => {
      return ((self.normDev() as number) * (max - min)) + min;
    };

    self.skewNormDev = (theta) => {
      if (theta < 0) {
        return (1 - (self.skewNormDev(-theta) as number));
      } else {
        return Math.pow((self.normDev() as number), theta);
      }
      //return  ?  : ;
    };

    self.skewNormInt = (min, max, theta) => {
      return Math.floor((self.skewNormDev(theta) as number) * (max - min) + min);
    };


    self.addDistribution = (distType, returnType, min, max, theta) => {
      min = min || 0;
      max = max || 1;
      theta = theta || 1;
      console.log(theta);
      const t = (((distType + returnType) as unknown as string).toLowerCase() as string);
      switch (t) {
        case 'uniformint':
          self.distributions.push(self.uniformInt.bind({}, min, max));
          break;
        case 'uniformfloat':
          self.distributions.push(self.uniformFloat.bind({}, min, max));
          break;
        case 'normalint':
          self.distributions.push(self.normInt.bind({}, min, max));
          break;
        case 'normalfloat':
          self.distributions.push(self.normFloat.bind({}, min, max));
          break;
        case 'skewnormalint':
          self.distributions.push(self.skewNormInt.bind({}, min, max, theta));
          break;
        default:
          throw new Error('Invalid Distribution Type');
      }
      return true;
    };

    self.clearAll = () => {
      while (self.distributions.length) { self.distributions.pop(); }
      return 1;
    }

    self.addNestedDistrobution = (distro)  => {
      self.distributions.push(distro.next);
      return true;
    };

    self.next = () => {
      if (self.distributions.length === 0) { throw new Error('No distributions added'); }
      const func = self.distributions[self.uniformInt(0, self.distributions.length) as number];
      return func();
    };
  }
}
