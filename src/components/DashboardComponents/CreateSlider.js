import { CloudUploadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Upload } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSlider } from "../../Hooks/useSlider";

const CreateSlider = (e) => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [image, setImage] = useState(null);
  const [Load, setLoad] = useState(false);

  const queryClient = useQueryClient();
  const [Sliders, isLoading, refetch] = useSlider();
  console.log(Sliders);

  const postSlider = (e) => {
    e.preventDefault();
    setLoad(true);
    const title = e.target.name.value;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "NJ_images");
    formData.append("cloud_name", "dvmwear6h");

    // post api call
    fetch("https://api.cloudinary.com/v1_1/dvmwear6h/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.asset_id) {
          const img = data.url;
          const Slider = { sliderTitle: title, img };
          const res = await axios.post(
            "https://api.websitesprofessional.com/api/v1/slider",
            Slider
          );
          if (res) {
            setLoad(false);
            refetch();
            if (res.data.success) {
              e.target.reset();
              navigate("/dashboard/slider");
              toast("Slider Post added Successfull");
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //clear all input field
  };

  return (
    <div>
      <form onSubmit={postSlider}>
        <div className="mb-5">
          <input
            name="name"
            type="text"
            className="border w-full h-14 pl-5"
            placeholder="Slider Name"
          />
        </div>
        <div className="my-5">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            maxCount={1}
            rules={[{ required: true }]}
            onChange={(e) => {
              setImage(e.file.originFileObj);
            }}
          >
            <Button
              className="w-44 md:w-80 h-20 border-dashed text-2xl"
              icon={<CloudUploadOutlined />}
            >
              Upload
            </Button>
          </Upload>
        </div>
        <div className="mt-8">
          <input
            type="submit"
            className="w-36 h-10 flex justify-center border border-1 border-red-500 items-center hover:text-white hover:bg-red-500 cursor-pointer"
            placeholder="Service Name"
            value={`${Load ? "Loading" : "Submit"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateSlider;
