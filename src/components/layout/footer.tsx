import content from '@/data/content.json';

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center w-full py-3 gap-1">
      <p className="text-sm text-center">{content.footer.warning}</p>
      <p className="text-sm font-semibold text-center">{content.footer.copyright}</p>
    </footer>
  );
}