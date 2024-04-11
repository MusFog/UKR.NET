export class CreateNewsDto {
  readonly name: string;
  readonly description: string;
  readonly category: string;
  user: string;
  readonly articles: ArticleDto[];
}
class ArticleDto {
  readonly title: string;
  readonly content: string;
}
