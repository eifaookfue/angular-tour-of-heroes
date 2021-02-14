import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private serchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // 検索語をobservableストリームにpushする
  search(term: string): void {
    this.serchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.serchTerms.pipe(
      // 各キーストロークのあと、検索前に300ms待つ
      debounceTime(300),

      // 直前の検索語と同じ場合は無視する
      distinctUntilChanged(),

      // 検索語が変わるたびに、新しい検索observableにスイッチする
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
