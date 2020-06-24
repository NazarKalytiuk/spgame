import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  pure: true
})
export class TimePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - (hours * 3600)) / 60);
    const seconds = value - (hours * 3600) - (minutes * 60);
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

}
