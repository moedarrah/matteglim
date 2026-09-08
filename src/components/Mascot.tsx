export function Mascot({ small = false }: { small?: boolean }) {
  return (
    <div className={`mascot ${small ? 'mascot-small' : ''}`} aria-hidden="true">
      <span className="mascot-eye eye-left" />
      <span className="mascot-eye eye-right" />
      <span className="mascot-cheek cheek-left" />
      <span className="mascot-cheek cheek-right" />
      <span className="mascot-smile" />
      <span className="mascot-foot foot-left" />
      <span className="mascot-foot foot-right" />
    </div>
  )
}
