import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from 'src/app/Services/Property/property.service';
import { MaterialModule } from 'src/app/AngularMaterial/material.module'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PropBookingComponent } from 'src/app/Components/PropertyDetails/prop-booking/prop-booking.component';
import { ReservationService } from 'src/app/Services/Property/reservation.service';
import { ReservationDto } from 'src/app/types/ReservationDto';
import { AuthenticationService } from 'src/app/Services/User/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-prop-details',
  templateUrl: './prop-details.component.html',
  styleUrls: ['./prop-details.component.css'],

})
export class PropDetailsComponent implements OnInit {

  propDetails: any;             //all details of property
  propId: any;                      //Id of property 
  pricePerNight!: any;
  numOfGuests: any = 2;         // number of guests the user reserving
  isPDisabled!: boolean;
  isMDisabled!: boolean;
  minDate = new Date();         //now date
  startDate: any;               //start date of reservation
  endDate: any;                 //end date of reservation
  numOfNights: any;             //number of nights the user reserving
  totalPrice: any;             //total price of booking
  range!: FormGroup;

  myHolidayDates = [
    new Date("7/10/2023"),
    new Date("7/11/2023"),
    new Date("7/12/2023"),
    new Date("7/13/2023")
];
myHolidayFilter = (d: Date): boolean => {
  const time=d.getTime();
  return !this.myHolidayDates.find(x=>x.getTime()==time);
}

  constructor(myRoute: ActivatedRoute, private propService: PropertyService, public myRouter: Router,
    private fb: FormBuilder, private authService: AuthenticationService, private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog, private snackBar: MatSnackBar, private reservationService: ReservationService) {
      this.dateAdapter.setLocale('en-GB');
    this.propId = myRoute.snapshot.params["id"];
    this.range = this.fb.group({
      start: null,
      end: null
    });
  }

  ngOnInit(): void {
    this.propService.GetPropertyById(this.propId).subscribe({
      next: (data) => { this.propDetails = data; console.log(data); },
      error: (error) => { console.log(error) },
      complete: () => { console.log("complete"); }
    })
  }


  // plus button function
  pButton() {
    if (this.numOfGuests < this.propDetails.maxNumOfGuest) {
      this.numOfGuests += 1;
      this.isMDisabled = false;
      if (this.numOfGuests == this.propDetails.maxNumOfGuest) {
        this.isPDisabled = true;
      }
    }
  }

  // minus button function
  mButton() {
    if (this.numOfGuests > 1) {
      this.numOfGuests -= 1;
      this.isPDisabled = false;
      if (this.numOfGuests == 1) {
        this.isMDisabled = true;
      }
    }
  }

  onDateRangeChange() {
    this.numOfNights = (this.endDate.getDate()) - (this.startDate.getDate());
    this.totalPrice = (this.numOfNights) * (this.propDetails.pricePerNight);
  }

  openPopup() {
    if (this.authService.isLoggedIn$.value) {
      if (this.startDate == null || this.endDate == null) {
        this.snackBar.open('Please select a reservation range first!', 'Close', {
          duration: 4000, // Duration in milliseconds
          verticalPosition: "top",
        });
      } else
        this.dialog.open(PropBookingComponent, {
          data: {
            title: 'Popup Title',
            message: 'Popup message'
          }
        });
      var resDto = new ReservationDto();
      resDto.numOfGuests = this.numOfGuests;
      resDto.pricePerNight = this.pricePerNight;
      resDto.StartDate = this.startDate;
      resDto.EndDate = this.endDate;
      resDto.numOfNights = this.numOfNights;
      resDto.totalPrice = this.totalPrice;
      resDto.propDetails = this.propDetails;
      resDto.propId = this.propId;
      this.reservationService.setReservationDto(resDto);
    } else if (this.startDate == null || this.endDate == null) {
      this.snackBar.open('Please select a reservation range first!', 'Close', {
        duration: 4000, // Duration in milliseconds
        verticalPosition: "top",
      });
    }
    else {
      this.myRouter.navigate(['/login']);
      this.snackBar.open('Please login first!', 'Close', {
        duration: 4000, // Duration in milliseconds
        verticalPosition: "top",
      });
    }
  }
}

