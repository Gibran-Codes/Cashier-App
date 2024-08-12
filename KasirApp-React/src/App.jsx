import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { Hasil, ListCategories, NavbarComponents } from "./components";
import { useEffect, useState } from "react";
import { API_URL } from "./utils/constans";
import axios from "axios";
import Menus from "./components/Menus";
import Swal from "sweetalert2";

function App() {
  const [menus, setMenus] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState("Makanan");
  const [keranjangs, setKeranjangs] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL + "products")
      .then((response) => {
        const menus = response.data;
        setMenus(menus);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(API_URL + "keranjangs")
      .then((response) => {
        const keranjang = response.data;
        setKeranjangs(keranjang); //
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [keranjangs]);

  const filterMenusByCategory = (category) => {
    setCategoriesSelected(category);
    axios
      .get(API_URL + "products?category.nama=" + category)
      .then((response) => {
        const menus = response.data;
        setMenus(menus);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const masukkanKeKeranjang = (value) => {
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then((response) => {
        if (response.data.length == 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
          };

          axios
            .post(API_URL + "keranjangs", keranjang)
            .then((response) => {
              Swal.fire({
                title: "Sukses Masuk Keranjang!",
                text: `${keranjang.product.nama} Berhasil Ditambahkan!`,
                icon: "success",
              });
            })
            .catch((error) => {
              console.error("Error fetching data: ", error);
            });
        } else {
          const keranjang = {
            jumlah: response.data[0].jumlah + 1,
            total_harga: response.data[0].total_harga + value.harga,
            product: value,
          };

          axios
            .put(API_URL + "keranjangs/" + response.data[0].id, keranjang)
            .then((response) => {
              Swal.fire({
                title: "Sukses Masuk Keranjang!",
                text: `${keranjang.product.nama} Berhasil Ditambahkan!`,
                icon: "success",
              });
            })
            .catch((error) => {
              console.error("Error fetching data: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    1;
  };

  return (
    <>
      <NavbarComponents />
      <div className="mt-3  ">
        <Container fluid>
          <Row>
            <ListCategories
              filterMenusByCategory={filterMenusByCategory}
              categoriesSelected={categoriesSelected}
            />
            <Col>
              <div className="kasir-app">
                <h4>
                  <strong>Daftar Produk</strong>
                </h4>
              </div>
              <Row>
                {menus &&
                  menus.map((menu) => (
                    <Menus
                      key={menu.id}
                      menu={menu}
                      masukkanKeKeranjang={masukkanKeKeranjang}
                    />
                  ))}
              </Row>
            </Col>
            <Hasil keranjangs={keranjangs} />
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
