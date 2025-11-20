import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { OwnerMenuComponent } from '../owner-menu/owner-menu.component';
import { BarElement, CategoryScale, Chart, ChartData, ChartType, Legend, LinearScale, Title, Tooltip,  } from 'chart.js'
import { Reservation } from '../models/reservation';
import { Cottage } from '../models/cottage';
import { CottageService } from '../services/cottage.service';
import { ReservationService } from '../services/reservation.service';
import { forkJoin } from 'rxjs';
import {
  BarController,
  PieController,
  ArcElement
} from 'chart.js';
import { Router } from '@angular/router';

// Register everything needed for your charts
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,    // needed for 'bar' chart
  PieController,    // needed for 'pie' chart
  ArcElement,       // needed for pie slices
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-owner-statistics',
  standalone: true,
  imports: [OwnerMenuComponent],
  templateUrl: './owner-statistics.component.html',
  styleUrl: './owner-statistics.component.css'
})
export class OwnerStatisticsComponent implements AfterViewInit{


  @ViewChild('histogramCanvas') private histogramCanvas!: ElementRef;
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef;


  owner = ""
  allReservations: Reservation[] = []
  myCottages: Cottage[]=[]
  myReservations: Reservation[]=[]

  pie_t: ChartType = 'pie'
  histo_t: ChartType = 'bar'

  months: string[] = ["JAN", "FEB", "MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
  pieNames: string[]= []
  days: string[]=["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

  monthDataByCott: number[]= Array(12).fill(0)
  workingDaysCnt = 0
  weekendDaysCnt = 0



  dataHistogram: ChartData<'bar'> = {
    labels: this.months,
    datasets: []
  }

  dataPie: ChartData<'pie'> ={
    labels: ["Working days", "Weekends"],
    datasets: [{
      data:[this.workingDaysCnt, this.weekendDaysCnt],
      backgroundColor: ['rgba(193, 124, 5, 1)','rgba(123, 193, 18, 1)']

    }]
  }

  private cs = inject(CottageService)
  private rs = inject(ReservationService)

  ngAfterViewInit(): void {
    let o = localStorage.getItem("logged")
    if(o){
      this.owner = o

      this.loadData()

    } else {
      alert("Greška.")
    }
  }

  loadData() {
    this.cs.getCottagesByOwner(this.owner).subscribe(cotts => {
      this.myCottages = cotts;

      // build an array of Observables for each cottage's reservations
      const requests = cotts.map(c =>
        this.rs.resBy_owner_place_name(this.owner, c.naziv, c.mesto)
      );

      // wait until ALL requests finish
      forkJoin(requests).subscribe(allResults => {
        // allResults is an array where each item = reservations for one cottage
        this.myReservations = allResults.flat(); // merge all arrays

        // now everything is loaded safely — ready to process for charts
        this.processData()
        this.renderHistogram()
        this.renderPie()
      });
    });
  }

  processData(){
    this.monthDataByCott = Array(12).fill(0)
    this.dataHistogram.datasets=[]
    this.weekendDaysCnt = 0
    this.workingDaysCnt = 0

     // Filter reservations for this cottage


    const cottageStats = new Map<string, number[]>();

    for (const r of this.myReservations) {
      const start = new Date(r.datum_od);
      const end = new Date(r.datum_do);
      const today = new Date();

      // only past and accepted reservations
      if (end <= today && r.status === 'prihvacena') {
        // make a unique key per cottage (name + place + owner)
        const key = `${r.cottName}_${r.cottPlace}_${r.vlasnik}`;
        if (!cottageStats.has(key)) {
          cottageStats.set(key, Array(12).fill(0));
        }

        // count monthly data
        const monthlyData = cottageStats.get(key)!;
        const month = start.getMonth();
        monthlyData[month]++;

        // working vs weekend
        const weekDay = start.getDay(); // 0=Sun, 6=Sat
        if (weekDay === 0 || weekDay === 6) this.weekendDaysCnt++;
        else this.workingDaysCnt++;
      }
    }

    // 🔹 Now build datasets from Map
    for (const [key, monthlyData] of cottageStats.entries()) {
      const label = key.split('_')[0]; // just use cottage name
      this.dataHistogram.datasets.push({
        label,
        data: monthlyData,
        backgroundColor: this.randomColor()
      });
    }

    this.dataPie.datasets[0].data = [this.workingDaysCnt, this.weekendDaysCnt]
  }


  histogramChart: Chart | null = null

  renderHistogram(){
    if(!this.histogramCanvas) return

    if (this.histogramChart) this.histogramChart.destroy()

    this.histogramChart = new Chart(this.histogramCanvas.nativeElement,{
      type: this.histo_t,
      data: this.dataHistogram,
      options:{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks:{
              stepSize: 1
            },
            grid: {
              display: false
            }
          }
        },
        plugins:{
          legend:{
            display: true
          }
        }
      }
    })
  }

  renderPie() {
    if(!this.pieCanvas) return
    new Chart(this.pieCanvas.nativeElement, {
      type: this.pie_t,
      data: this.dataPie,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  }

  private router = inject(Router)

  passChange(){
    this.router.navigate(['../updatePassword'])
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }

  randomColor(): string {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 50%)`
  }

}
