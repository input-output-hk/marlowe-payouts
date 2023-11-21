export interface ILink {
    displayText: string;
    href: string;
  }

export type FooterConfiguration = {
    socialMediaLinks: {
      href: string;
      logo: string;
      alt: string;
    }[];
    footerLinks: {
      title: string;
      links: ILink[];
    }[];
  }
  