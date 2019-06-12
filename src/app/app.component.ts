import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Attachment {
  width: number;
  height: number;
  url: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  content: string;
  attachments?: Attachment[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  title = 'ozaning';
  loading = true;
  data: Post = undefined;
  posts: Post[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://ozandundar.com/test/wp-json/wp/v2/posts').subscribe(
      (result: any[]) => {
        this.posts = result.map((r) => ({
          id: r.id,
          title: r.title.rendered,
          slug: r.slug,
          content: r.content.rendered,
          status: r.status
        }));

        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );

    this.http.get('http://ozandundar.com/test/wp-json/wp/v2/posts/14').subscribe(
      (r: any) => {
        this.data = {
          id: r.id,
          title: r.title.rendered,
          slug: r.slug,
          content: r.content.rendered,
          status: r.status
        };

        this.http.get('http://ozandundar.com/test/wp-json/wp/v2/media?parent=14').subscribe((attachments: any[]) => {
          if (attachments.length > 0) {
            this.data.attachments = attachments.map((att: any) => ({
              width: att.media_details.width,
              height: att.media_details.height,
              url: att.media_details.sizes.full.source_url
            }));
          }
        });

        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }
}
