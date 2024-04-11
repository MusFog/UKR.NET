import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { LoaderComponent } from "../shared/components/loader/loader.component";
import { RouterLink } from "@angular/router";
import { News, NewsResponse } from "../shared/interfaces";
import { NewsServices } from "../shared/services/news.services";
import { MaterialService } from "../shared/classes/material.service";
import { Subscription } from "rxjs";

const STEP = 5;

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  news: News[] = [];
  offset = 0;
  limit = STEP;
  allDataLoaded = false;
  loading = false;
  Sub!: Subscription;

  constructor(private newsService: NewsServices) {}

  ngOnInit() {
    this.loadMore();
  }

  loadMore() {
    if (this.allDataLoaded) {
      return
    }
    this.loading = true
    this.Sub = this.newsService.fetchP({ offset: this.offset, limit: this.limit })
      .subscribe((response: NewsResponse) => {
        this.news = [...this.news, ...response.data]
        this.offset += response.data.length
        this.loading = false
        if (this.offset >= response.total) {
          this.allDataLoaded = true
        }
      }, (error) => {
        MaterialService.toast(error.error.message)
        this.loading = false
      })
  }

  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe();
    }
  }
}
