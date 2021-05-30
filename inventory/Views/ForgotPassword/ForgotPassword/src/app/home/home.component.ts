import { Component, OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router,private route:ActivatedRoute) {}

  ngOnInit() {
  }

}
