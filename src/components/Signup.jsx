import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";

export default function SignupCard() {
  return (
    <Card className="mx-auto w-96 mt-10">
      <img
        src="logo.png"
        alt="logo.png"
        className="mx-auto"
        width={"60px"}
        height={"60px"}
      />
      <CardBody className="flex flex-col gap-4">
        <Input label="First Name" size="lg" />
        <Input label="Last Name" size="lg" />
        <Input label="Phone Number" size="lg" />
        <Input label="Date Of Birth" size="lg" />
        <Input label="Password" size="lg" />
        <Input label="Cofirm Password" size="lg" />
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" color="pink" fullWidth>
          Sign Up
        </Button>
        <Typography variant="small" className="mt-6 flex justify-center">
          Already have an account?
          <Typography
            as="a"
            href="login"
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold"
          >
            Login
          </Typography>
        </Typography>
      </CardFooter>
    </Card>
  );
}
