import { useSound } from '../hooks/useSound'
import { Link } from 'react-router'
import { t } from '../config/translations'
import { Mascot } from '../components/Mascot'
export function HomePage() {
  const { play } = useSound()
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true">✦</span> {t.welcome}
          </p>
          <h1>
            {t.headline}
            <br />
            <span>{t.headlineAccent}</span>
          </h1>
          <p className="intro">{t.introduction}</p>
          <Link
            to="/levels"
            onClick={() => play('tap')}
            className="primary-link start-link"
          >
            {t.start}
            <span aria-hidden="true">→</span>
          </Link>
          <p className="home-note">{t.homeNote}</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="floating-number number-three">3</span>
          <span className="floating-number number-seven">7</span>
          <span className="art-plus">+</span>
          <span className="art-times">×</span>
          <span className="art-star">✦</span>
          <div className="speech-bubble">{t.mascotBubble}</div>
          <Mascot />
          <span className="mascot-shadow" />
        </div>
      </section>
      <div className="feature-strip">
        <div>
          <span className="feature-icon mint" aria-hidden="true">
            ✚
          </span>
          {t.featurePlay}
        </div>
        <div>
          <span className="feature-icon yellow" aria-hidden="true">
            ★
          </span>
          {t.featureStars}
        </div>
        <div>
          <span className="feature-icon lavender" aria-hidden="true">
            ↗
          </span>
          {t.featureGrow}
        </div>
      </div>
    </div>
  )
}
