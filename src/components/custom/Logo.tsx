
type Props = {
  logo: string;
};

const Logo = (props: Props) => {
  const { logo = "" } = props;
  return (
    <img
      src={logo ?? ""}
      height={50}
      width={50}
      className="h-14 w-14 object-contain"
      alt={"Logo"}
    />
  );
};

export default Logo;
