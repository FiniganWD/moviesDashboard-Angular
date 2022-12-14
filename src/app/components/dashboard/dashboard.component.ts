import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movies } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/service/movies.service';
import { Favourites } from 'src/app/interfaces/favourites.interface';
import { FavouritesService } from 'src/app/service/favourites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
  <app-navbar></app-navbar>
  <div class="container-fluid" id="film">
      <div class="row justify-content-center">
          <div class="container d-flex flex-wrap justify-content-center mt-3">
              <div *ngFor="let movie of movies" class="card m-2" style="width: 19rem; background-color: black">
                  <img src="http://image.tmdb.org/t/p/w500/{{movie.poster_path}}" class="card-img-top" alt="..." />
                  <div class="card-body">
                      <h2 class="card-text text-white">{{movie.title}}</h2>
                      <a class="btn {{movie.like ? 'text-danger' : 'text-secondary'}} fs-5"  (click)="like(movie.id, $event)"><i class="bi bi-heart-fill"></i></a>
                  </div>
              </div>
          </div>
      </div>
      <div class="container d-flex justify-content-center mt-3" id="loading">
          <div class="spinner-border d-flex justify-content-center text-white" role="status" *ngIf="loading">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>
  </div>
  `,
  styles: [
    '#film{ margin-top: 70px; background: #333 }'
  ]
})

export class DashboardComponent implements OnInit {

  sub!: Subscription
  movies: Movies[] | undefined
  loading = true;
  userdata: any = []
  favorites: Favourites[] | undefined

  constructor(private http: HttpClient, private movSrv: MoviesService, private favSrv: FavouritesService) { }

  ngOnInit(): void {
    this.getFilms();
    this.getUser();
    this.load();
  }

  load() {
    this.movSrv.getMovies().subscribe(movies => {
        this.movies = movies;
        if (this.userdata.user.id !== null) {
            this.favSrv.getFavourites().subscribe(fav => {
                this.movies = this.movies!.map(movie => {
                    if (fav.find(value => value.movieId === movie.id && value.userId === this.userdata.user.id)) {
                        movie.like = true;
                        movie.userId = this.userdata.user.id;
                    }
                    return movie;
                });
            });
        }
    });
  }

  getFilms() {
    this.sub = this.movSrv.getMovies().subscribe((ris) => {
      this.movies = ris;
      this.loading = false;
    })
  }

  getUser() {
    let userLogged: any = localStorage.getItem('user');
    this.userdata = JSON.parse(userLogged);
  }

  like(movie: any, event: any) {
    //ottengo l'array dei favoriti
    this.sub = this.favSrv.getFavourites().subscribe((ris) => {
        this.favorites = ris;

        //controllo se l'elemento esiste
        if (ris.find(item => item.movieId === movie && item.userId === this.userdata.user.id)) {
          event.target.classList.remove('text-danger');
          event.target.classList.add('text-secondary');

          //se esiste, mi controlli se i dati sono uguali e mi restituisci l'id del dato da eliminare
          const item = ris.find(item => item.movieId === movie && item.userId === this.userdata.user.id);
          const id = item ? item.id : undefined;



          //Elimina quel dato dal json favoriti
          this.sub = this.favSrv.deleteFavourites(id!).subscribe((ris) => {
            console.log('Elemento rimosso dai preferiti')
          });
          //altrimenti se non esiste
        } else {
          event.target.classList.remove('text-secondary');
          event.target.classList.add('text-danger');
          // mi crei un nuovo oggetto
          let newFavorite: {
            movieId: number,
            userId: number
          } = {
            movieId: movie,
            userId: this.userdata.user.id
          }
          //me lo aggiungi nel json favoriti
          this.sub = this.favSrv.postFavourites(newFavorite).subscribe((ris) => {
            console.log('Elemento aggiunto ai preferiti!')
          });
        }
    });
  }

}
