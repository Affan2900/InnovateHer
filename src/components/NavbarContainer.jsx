import NavbarWrapper from '@/components/NavbarWrapper';

async function NavbarContainer({params}) {
  const { locale }= params;
  
  return (
    <NavbarWrapper locale={locale} />
  )
}

export default NavbarContainer;