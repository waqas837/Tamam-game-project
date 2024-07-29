import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
} from "@material-tailwind/react";

export default function CardDefault({ name, desc }) {
  return (
    <Tooltip
      className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-pink-400/10"
      content={
        <div className="w-64">
          <Typography
            variant="small"
            color="pink"
            className="font-normal opacity-80 rounded-xl"
            style={{ fontFamily: "Mooli" }}
          >
            {desc}
          </Typography>
        </div>
      }
    >
      <Card className="mt-6 cursor-pointer bg-pink-500">
        <CardHeader color="pink">
          <img
            src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            alt="card-image"
          />
        </CardHeader>
        <CardBody>
          <Typography
            style={{ fontFamily: "Mooli" }}
            variant="h5"
            color="white"
            className="mb-2"
          >
            {name}
          </Typography>
        </CardBody>
      </Card>
    </Tooltip>
  );
}
