import { Button } from 'antd'
import { useSound } from '../hooks/useSound'
import { t } from '../config/translations'
export function SoundToggle() {
  const { enabled, toggle } = useSound()
  return (
    <Button
      className="sound-toggle"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={t.sound}
    >
      <span aria-hidden="true">{enabled ? '🔊' : '🔇'}</span>
      {enabled ? t.soundOn : t.soundOff}
    </Button>
  )
}
