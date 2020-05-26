import * as React from 'react'
import { faGit as git } from '@fortawesome/free-brands-svg-icons/faGit'
import { faFacebook as facebook } from '@fortawesome/free-brands-svg-icons/faFacebook'
import { faTwitter as twitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faReddit as reddit } from '@fortawesome/free-brands-svg-icons/faReddit'

import Icon from './Icon'

const social = [
  { url: 'https://github.com/danielfgray', icon: git },
  { url: 'https://fb.me/danielfgray', icon: facebook },
  { url: 'https://twitter.com/danielfgray', icon: twitter },
  { url: 'https://reddit.com/u/danielfgray', icon: reddit },
]

const Footer: React.FC = () => (
  <footer className="footer">
    <ul className="social">
      {social.map(({ url, icon }) => (
        <li key={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Icon i={icon} size="2x" />
          </a>
        </li>
      ))}
    </ul>
  </footer>
)

export default Footer
