import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { TrustedClients } from '../../components/trusted-clients/trusted-clients';
import { About } from '../../components/about/about';
import { Services } from '../../components/services/services';
import { CardShowcase } from '../../components/card-showcase/card-showcase';
import { WhyChooseUs } from '../../components/why-choose-us/why-choose-us';
import { Roi } from '../../components/roi/roi';
import { Testimonials } from '../../components/testimonials/testimonials';
import { Faq } from '../../components/faq/faq';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    TrustedClients,
    About,
    Services,
    CardShowcase,
    WhyChooseUs,
    Roi,
    Testimonials,
    Faq,
    Contact,
    Footer,
  ],
  templateUrl: './home.html',
})
export class Home {}
