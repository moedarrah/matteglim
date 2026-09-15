import { t } from '../config/translations'

export function PlaceValueBlocks({
  tens,
  ones,
}: {
  tens: number
  ones: number
}) {
  return (
    <div
      className="place-blocks"
      role="img"
      aria-label={t.placeValue.blocks(tens, ones)}
    >
      <div className="tens-boxes" aria-hidden="true">
        {Array.from({ length: tens }, (_, index) => (
          <span className="ten-box" key={index}>
            10
          </span>
        ))}
      </div>
      <div className="ones-balls" aria-hidden="true">
        {Array.from({ length: ones }, (_, index) => (
          <span className="one-ball" key={index} />
        ))}
      </div>
      {tens === 0 && ones === 0 && (
        <span aria-hidden="true">{t.placeValue.empty}</span>
      )}
    </div>
  )
}
