/* eslint-disable react/prop-types */
import { Box, Link } from "@mui/material";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { RiDraggable } from "react-icons/ri";

const ProductVariant = ({ variants = [], removeVariant = () => {} }) => {
  const [showVariants, setShowVariants] = useState(false);
  return !showVariants ? (
    <Box className="flex-end-center">
      <Link onClick={() => setShowVariants(true)}>
        Show Variants <IoIosArrowDown />
      </Link>
    </Box>
  ) : (
    <Box sx={{ marginInlineStart: "3rem" }} className="mb-10">
      {variants.map((variant, index) => (
        <Box key={variant?.id} className="flex-between-center mb-10">
          <RiDraggable fontSize={"1.5rem"} className="cursor-pointer" />
          <Box className="variant_name">
            <span style={{ color: "#00000080" }}>{variant?.title}</span>
          </Box>
          <MdOutlineCancel
            fontSize={"1.5rem"}
            className="cursor-pointer"
            onClick={() => {
              removeVariant(index);
            }}
          />
        </Box>
      ))}
      <Box className="flex-end-center">
        <Link onClick={() => setShowVariants(false)}>
          Hide Variants <IoIosArrowUp />
        </Link>
      </Box>
    </Box>
  );
};

export default ProductVariant;
