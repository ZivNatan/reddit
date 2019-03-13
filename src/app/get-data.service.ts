import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class GetDataService {
  constructor(private http: HttpClient) {}

  get(param, state, paylod) {
    return this.http.get(
      `https://www.reddit.com/r/${param}/new.json?limit=10${
        state ? "&" + state + "=" + paylod.kind + "_" + paylod.id : ""
      }`
    );
  }
}
