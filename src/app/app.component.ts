import { Component, OnInit } from '@angular/core';
import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'testing';

  ngOnInit() {
    const calculator = new Calculator();
    const result = calculator.multiply(2, 3);
    console.log(result);
    const otherResult = calculator.multiply(6, 3);
    console.log(otherResult);
  }
}
