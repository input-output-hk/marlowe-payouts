import React, {  } from 'react';
import './footer.scss';
import { FooterConfiguration } from './Configuration';
import { ICON_SIZES } from '../Adapters/Icon';

export const Footer = ({ footerLinks, socialMediaLinks }: FooterConfiguration) => {
  return (
    <footer style={{paddingTop:"10px",paddingBottom:"30px"}}>
      <hr />
      <div className='d-flex justify-content-between'>
        <div className="d-flex justify-content-start align-items-baseline" >
          {footerLinks.map((footerLink) => {
            return (
              <div key={footerLink.title} style={{marginRight:"60px"}}>
                <b className="text-purple">{footerLink.title}</b><br/>
                {footerLink.links.map((link) => (
                  <div style={{fontSize:"smaller"}}><a
                    href={link.href}
                    target="_blank"
                    className="block"
                    key={link.displayText} rel="noreferrer"
                  >
                    {link.displayText}
                  </a><br/></div>
                ))}
              </div>
            );
          })}
        </div>

        <div >
          <img src="/images/marlowe-logo-primary.svg" data-light="true" alt="Logo" />
          <div className="d-flex justify-content-center" >
            {socialMediaLinks.map((social) => (
              
              <a
                href={social.href}
                target="_blank"
                key={social.alt}
                style={{padding:"5px"}}
                className="block cursor-pointer hover:brightness-50" rel="noreferrer"
              >
                <img
                  src={social.logo}
                  alt={social.alt}
                  
                  height={ICON_SIZES.M}
                  width={ICON_SIZES.M}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center" style={{marginTop:"30px"}}>
        &copy; 2023 Input Output Global, Inc. All Rights Reserved.
      </div>
    </footer>
  );
};
