import { isPrinted } from "@/lib/catalog-meta";
import type { Product } from "@/lib/data";

type Props = {
  src: string;
  alt: string;
  printed?: boolean;
  className?: string;
  imgClassName?: string;
  proof?: string;
};

export function TinStage({ src, alt, printed, className = "", imgClassName = "", proof }: Props) {
  const caption = proof || (printed ? "Offset litho · custom print" : "Tinplate · bulk supply");
  return (
    <div className={`tin-stage ${className}`}>
      <img className={`tin-stage-can ${imgClassName}`} src={src} alt={alt} />
      <div className="tin-stage-reflect" aria-hidden>
        <img src={src} alt="" />
      </div>
      <p className="tin-stage-proof">{caption}</p>
    </div>
  );
}

export function productPrinted(product: Product) {
  return isPrinted(product);
}
