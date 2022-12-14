import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favourites } from '../interfaces/favourites.interface';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  constructor(private http: HttpClient) { }

  getFavourites(): Observable<Favourites[]> {
    return this.http.get<Favourites[]>('http://localhost:4201/favorites');
  }

  postFavourites(newFavorite: Partial<Favourites>) {
    return this.http.post<Favourites>('http://localhost:4201/favorites', newFavorite);
  }

  deleteFavourites(id: number) {
    return this.http.delete(`http://localhost:4201/favorites/${id}`);
  }

}
