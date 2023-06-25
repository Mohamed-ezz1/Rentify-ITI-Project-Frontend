import { Injectable } from '@angular/core';
import { LoginDto } from '../../types/LoginDto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenDto } from '../../types/TokenDto';
import { HttpClient } from '@angular/common/http';
import { RegisterDto } from '../../types/Register';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private client: HttpClient) { }

  private readonly Base_URL = "https://localhost:7108/api/User/Register";


  AddUser(newUser: RegisterDto) {
    console.log(newUser)
    return this.client.post(this.Base_URL, newUser);

  }





  public login(credentials: LoginDto): Observable<TokenDto> {
    return this.client
      .post<TokenDto>('https://localhost:7108/api/User/Login', credentials)
      .pipe(
        tap((tokenDto) => {
          this.isLoggedIn$.next(true);
          localStorage.setItem('token', tokenDto.token);
        })
      );
  }
}




