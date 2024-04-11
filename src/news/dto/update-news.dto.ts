export class UpdateNewsDto {
  readonly name?: string;
  readonly description?: string;
  readonly category?: string;
  readonly articles?: ArticleDto[];
}

class ArticleDto {
  readonly title: string;
  readonly content: string;
}
