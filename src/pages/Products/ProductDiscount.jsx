/* eslint-disable react/prop-types */
import { NativeSelect, OutlinedInput } from "@mui/material";
import { useState } from "react";

const ProductDiscount = ({ product, setDiscount }) => {
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  return (
    <>
      {showDiscountInput ? (
        <>
          <OutlinedInput
            name="discount"
            placeholder="discount"
            onChange={(e) => {
              const { value, name } = e.target;
              setDiscount(name, value);
            }}
            size="small"
            value={product?.discount ?? 0}
          />
          <NativeSelect
            value={product?.discount_type ?? 1}
            onChange={(e) => {
              const { value } = e.target;
              setDiscount("discount_type", value);
            }}
            input={<OutlinedInput size="small" />}
            size="small"
          >
            <option value={1}>Flat</option>
            <option value={2}>Percentage</option>
          </NativeSelect>
        </>
      ) : (
        <div
          className="add_discount"
          onClick={() => {
            setShowDiscountInput(true);
          }}
        >
          Add Discount
        </div>
      )}
    </>
  );
};

export default ProductDiscount;
