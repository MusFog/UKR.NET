import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { News, NewsResponse } from "../interfaces";
import {BehaviorSubject, Observable, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewsServices {

  constructor(private http: HttpClient) {
  }
  create(news: News): Observable<News> {
    return this.http.post<News>('http://localhost:5000/news', news)
  }
  getById(id: string): Observable<News> {
    return this.http.get<News>(`http://localhost:5000/news/${id}`)
  }
  updateById(news: News): Observable<News> {
    return this.http.put<News>(`http://localhost:5000/news/${news._id}`, news)
  }
  deleteById(news: News): Observable<any> {
    return this.http.delete(`http://localhost:5000/news/${news._id}`)
  }
  fetchByCategoryId(categoryIds: string | string[]): Observable<News[]> {
    let params = new HttpParams()

    if (Array.isArray(categoryIds)) {
      categoryIds.forEach(id => params = params.append('categoryId', id))
    } else {
      params = params.append('categoryId', categoryIds)
    }
    return this.http.get<News[]>('http://localhost:5000/news', { params })
  }
  fetch(params: any = {}): Observable<News[]> {
    return this.http.get<News[]>('http://localhost:5000/news', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
  fetchP(params: any = {}): Observable<NewsResponse> {
    return this.http.get<NewsResponse>('http://localhost:5000/news/all', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }


  addComment(newsId: string | undefined, comment: { text: string, userId: string }): Observable<News> {
    return this.http.post<News>(`http://localhost:5000/news/comment/${newsId}`, comment)
  }
}
