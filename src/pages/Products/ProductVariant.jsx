/* eslint-disable react/prop-types */
import { Box, Link } from "@mui/material";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { RiArrowDropDownLine, RiDraggable } from "react-icons/ri";

const ProductVariant = ({ variants = [] }) => {
    const [showVariants,setShowVariants]=useState(false)
  return !showVariants ? (
    <Box className="flex-end-center">
      <Link onClick={() => setShowVariants(true)}>
        Show Variants <RiArrowDropDownLine />
      </Link>
    </Box>
  ) : (
    <Box sx={{ marginInlineStart: "3rem" }} className="mb-10">
      {variants.map((variant) => (
        <Box key={variant?.id} className="flex-between-center mb-10">
          <RiDraggable fontSize={"1.5rem"} className="cursor-pointer" />
          <Box className="variant_name">{variant?.title}</Box>
          <MdOutlineCancel fontSize={"1.5rem"} className="cursor-pointer" />
        </Box>
      ))}
    </Box>
  );
};

export default ProductVariant;