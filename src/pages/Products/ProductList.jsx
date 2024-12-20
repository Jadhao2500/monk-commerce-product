import { Box, Button, Checkbox, CircularProgress } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { RiDraggable } from "react-icons/ri";
import { PRODUCT_SEARCH } from "../../Api/apiEndpoints";
import CustomModal from "../../Components/CustomModal";
import useDebounce from "../../hooks/useDebounce";
import ProductDiscount from "./ProductDiscount";
import ProductVariant from "./ProductVariant";
import "./style.css";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_KEY = import.meta.env.VITE_APP_HEADER_KEY;

const ProductList = () => {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [currentSelectedProducts, setCurrentSelectedProducts] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [isProductListLoading, setIsProductListLoading] = useState(false);

  const debouncedQuery = useDebounce(search, 500);

  useEffect(() => {
    getProductList(debouncedQuery);
  }, [debouncedQuery]);

  const getProductList = async (search = "") => {
    setIsProductListLoading(true);
    const result = await axios.get(`${BASE_URL}/${PRODUCT_SEARCH}`, {
      headers: {
        "x-api-key": API_KEY,
      },
      params: {
        search: search,
        page: 1,
        limit: 10,
      },
    });
    setIsProductListLoading(false);
    if (Array.isArray(result?.data) && result.data.length) {
      setProductList([...result.data]);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  const handleModalOpen = (index = 0) => {
    setSelectedIndex(index);
    setProductModalOpen(true);
  };

  const handleModalClose = () => {
    setProductModalOpen(false);
  };

  const handleModalSubmit = () => {
    const products = [...selectedProducts];
    products.splice(
      selectedIndex,
      1,
      ...Object.values(currentSelectedProducts)
    );
    setCurrentSelectedProducts([]);
    setSearch("");
    setSelectedProducts([...products]);
    setProductModalOpen(false);
  };

  const handleProductSelected = (product, checked, variants) => {
    const selectedProducts = { ...currentSelectedProducts };
    const currentProduct = { ...product };
    currentProduct["variants"] = variants;
    if (checked) {
      selectedProducts[product?.id] = currentProduct;
    } else {
      delete selectedProducts[product?.id];
    }
    setCurrentSelectedProducts({ ...selectedProducts });
  };

  const handleRemoveProduct = (index) => {
    const products = [...selectedProducts];
    products.splice(index, 1);
    setSelectedProducts([...products]);
  };

  const handleRemoveVariant = (productIndex, variantIndex) => {
    const products = [...selectedProducts];
    const currentVariants = products[productIndex]?.variants ?? [];
    currentVariants.splice(variantIndex, 1);
    products["variants"] = currentVariants;
    setSelectedProducts([...products]);
  };

  return (
    <Box>
      <Box sx={{ display: "flex" }} className="mb-10">
        <span>Selected Products</span>
      </Box>
      {selectedProducts.map((product, index) => (
        <Box key={product?.id} className="mb-10" sx={{ width: "60vw" }}>
          <Box
            key={product?.id}
            sx={{
              display: "flex",
              gap: "10px",
              textAlign: "center",
              alignItems: "center",
            }}
            className="mb-10"
          >
            <RiDraggable fontSize={"1.5rem"} className="cursor-pointer" />
            <div className="product_input">
              <span style={{ color: "#00000080" }}>{product?.title}</span>
              <span
                style={{ position: "absolute", right: "20px" }}
                className="cursor-pointer"
              >
                <MdEdit onClick={() => handleModalOpen(index)} />
              </span>
            </div>
            <ProductDiscount
              product={product}
              setDiscount={(key, value) => {
                const products = [...selectedProducts];
                products[index][key] = value;
                setSelectedProducts([...products]);
              }}
            />
            <MdOutlineCancel
              fontSize={"1.5rem"}
              className="cursor-pointer"
              onClick={() => {
                handleRemoveProduct(index);
              }}
            />
          </Box>
          {product?.variants?.length ? (
            <ProductVariant
              variants={product?.variants}
              removeVariant={(variantIndex) => {
                handleRemoveVariant(index, variantIndex);
              }}
            />
          ) : (
            <></>
          )}
        </Box>
      ))}
      {selectedProducts.length ? (
        <Box className="flex-end-center w-100" sx={{ width: "60vw" }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              handleModalOpen(selectedProducts.length);
            }}
          >
            Add Products
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            textAlign: "center",
            alignItems: "center",
            width: "60vw",
          }}
        >
          <RiDraggable fontSize={"1.5rem"} className="cursor-pointer" />
          <div className="product_input">
            <span style={{ color: "#00000080" }}>Select Products</span>
            <span
              style={{ position: "absolute", right: "20px" }}
              className="cursor-pointer"
            >
              <MdEdit onClick={handleModalOpen} />
            </span>
          </div>
          <div className="add_discount">Add Discount</div>
          <MdOutlineCancel fontSize={"1.5rem"} className="cursor-pointer" />
        </Box>
      )}
      <CustomModal
        open={productModalOpen}
        onModalClose={handleModalClose}
        onModalSubmit={handleModalSubmit}
        cancelButton={"Cancel"}
        submitButton={"Submit"}
      >
        <div style={{ width: "30rem" }}>
          <div>
            <OutlinedInput
              value={search}
              startAdornment={<CiSearch fontSize={"2rem"} />}
              placeholder="Search Products"
              fullWidth
              size="small"
              onChange={(e) => {
                const { value } = e.target;
                setSearch(value);
              }}
            />
          </div>
          {isProductListLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : (
            <div>
              {productList.map((product) => (
                <div key={product?.id}>
                  <div className="product_name">
                    <Checkbox
                      color="success"
                      checked={Object.keys(currentSelectedProducts).includes(
                        String(product?.id)
                      )}
                      onChange={(event) => {
                        const { checked } = event.target;
                        handleProductSelected(
                          product,
                          checked,
                          product?.variants
                        );
                      }}
                      indeterminate={
                        (currentSelectedProducts?.[product?.id]?.variants ?? [])
                          .length !== 0 &&
                        (currentSelectedProducts?.[product?.id]?.variants ?? [])
                          .length < (product?.variants ?? []).length
                      }
                    />
                    <img
                      src={product?.image?.src}
                      // alt={`${product?.title}`}
                      style={{ height: "2rem", width: "2rem" }}
                    />
                    <span>{product?.title}</span>
                  </div>
                  {(product?.variants ?? []).map((variant) => (
                    <div key={variant?.id} className="product_variants_name">
                      <div className="flex-between-center">
                        <Checkbox
                          color="success"
                          checked={(
                            currentSelectedProducts?.[product?.id]?.variants ??
                            []
                          ).some((el) => el?.id === variant?.id)}
                          onChange={(event) => {
                            const { checked } = event.target;
                            const selectedVariants = [
                              ...(currentSelectedProducts?.[product?.id]
                                ?.variants ?? []),
                            ];
                            if (checked) {
                              selectedVariants.push(variant);
                            } else {
                              const index = selectedVariants.findIndex(
                                (el) => el?.id === variant?.id
                              );
                              selectedVariants.splice(index, 1);
                            }
                            handleProductSelected(
                              product,
                              selectedVariants.length,
                              selectedVariants
                            );
                          }}
                        />
                        <span>{variant?.title}</span>
                      </div>
                      <div className="flex-end-center">
                        <span>${variant?.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </CustomModal>
    </Box>
  );
};

export default ProductList;
