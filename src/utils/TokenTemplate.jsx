// components/TokenTemplate.jsx
import { View, Text, Image } from "@react-pdf/renderer";

const wrapTextByWords = (text = "", maxCharsPerLine = 16) => {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    const nextLine = `${currentLine} ${word}`;

    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join("\n");
};

const getValue = (coupon, key) => {
  const value = coupon?.[key];
  if (value === null || value === undefined) return "";
  return String(value);
};

const TokenTemplate = ({
  coupon,
  barcode,
  agentNameQr,
  fieldBarcodes,
  couponWidthPt,
  couponHeightPt,
  fontSize,
}) => {
  const labelSize = fontSize * 0.78;
  const valueSize = fontSize * 0.96;
  const headerValue = fontSize * 1.18;
  const headerLabel = fontSize * 0.78;
  const barcodeText = fontSize * 0.85;
  const barcodeHeight = fontSize * 4.6;

  const rows = [
    ["PRODUCT", "PRODUCT1"],
    ["ORDER", "PART NO."],
    ["WIDTH", "LENGTH"],
    ["SPLICE", "WEIGHT"],
    ["SLIT ID", "ROLL ID"],
    ["SLIT BY", "CORE ID"],
    ["QUANTITY MSI", "PRODUCT BARCODE"],
  ];

  const textSize = 11;
  const productText = getValue(coupon, "PRODUCT");
  const productText2 = getValue(coupon, "PRODUCT1");
  const labelWidth = 90;
  const leftPairWidth = labelWidth + 140;
  const getFirstValue = (keys) => {
    for (const key of keys) {
      const value = coupon?.[key];
      if (value !== null && value !== undefined && value !== "") return String(value);
    }
    return "";
  };

  const tableFields = [
    { label: "PRODUCT", keys: ["PRODUCT BARCODE", "PRODUCT"] },
    { label: "QUANTITY", keys: ["QUANTITY", "QUANTITY MSI"] },
    { label: "LENGTH", keys: ["LENGTH"] },
    { label: "WIDTH", keys: ["WIDTH"] },
    { label: "CORE ID", keys: ["CORE ID"] },
    {
      label: "CUST ORDER",
      keys: ["ORDER"],
    },
  ];

  const field0 = tableFields[0];
  const field1 = tableFields[1];
  const field2 = tableFields[2];
  const field3 = tableFields[3];
  const field4 = tableFields[4];
  const field5 = tableFields[5];

  const value0 = getFirstValue(field0.keys);
  const value1 = getFirstValue(field1.keys);
  const value2 = getFirstValue(field2.keys);
  const value3 = getFirstValue(field3.keys);
  const value4 = getFirstValue(field4.keys);
  const value5 = getFirstValue(field5.keys);
  const headingRowFlex = 0.68;
  const topHeadingRowFlex = 0.74;
  const barcodeRowFlex = 1.32;

  const barcode0 = fieldBarcodes?.[field0.label];
  const barcode1 = fieldBarcodes?.[field1.label];
  const barcode2 = fieldBarcodes?.[field2.label];
  const barcode3 = fieldBarcodes?.[field3.label];
  const barcode4 = fieldBarcodes?.[field4.label];
  const barcode5 = fieldBarcodes?.[field5.label];

  return (
    <View
      wrap={false}
      style={{
        width: couponWidthPt,
        height: couponHeightPt,
        display: "flex",
        flexDirection: "row",
        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor: "grey",
      }}
    >
      <View
        style={{
          width: 363.959,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          // backgroundColor: "green",
          position: "relative",
          paddingTop: 56,
          gap: 5,
        }}
      >
        {!!agentNameQr && (
          <Image
            src={agentNameQr}
            style={{
              position: "absolute",
              top: 45,
              right: 30,
              width: 50,
              height: 50,
            }}
          />
        )}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text
            style={{
              width: labelWidth,
              fontFamily: "Helvetica",
              fontWeight: 600,
              fontSize: textSize,
            }}
          >
            AGENT NAME
          </Text>
          <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
            {getValue(coupon, "AGENT NAME")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text
            style={{
              width: labelWidth,
              fontFamily: "Helvetica",
              fontWeight: 600,
              fontSize: textSize,
            }}
          >
            CLIENT
          </Text>
          <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
            {getValue(coupon, "CUSTOMER")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text
            style={{
              width: labelWidth,
              fontFamily: "Helvetica",
              fontWeight: 600,
              fontSize: textSize,
            }}
          >
            PRODUCT
          </Text>
          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={{
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              {wrapTextByWords(productText, 40)}
            </Text>
            {!!productText2 && (
              <Text
                style={{
                  fontFamily: "Helvetica",
                  fontWeight: 600,
                  fontSize: textSize,
                }}
              >
                {wrapTextByWords(productText2, 40)}
              </Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 18 }}>
          <View style={{ width: 145, flexDirection: "row", gap: 8 }}>
            <Text
              style={{
                width: labelWidth,
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              ORDER
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
              {getValue(coupon, "ORDER")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text
              style={{
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              PART NO :-
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
              {getValue(coupon, "PART NO.")}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text
            style={{
              width: labelWidth,
              fontFamily: "Helvetica",
              fontWeight: 600,
              fontSize: textSize,
            }}
          >
            WIDTH
          </Text>
          <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
            {getValue(coupon, "WIDTH")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text
            style={{
              width: labelWidth,
              fontFamily: "Helvetica",
              fontWeight: 600,
              fontSize: textSize,
            }}
          >
            LENGTH
          </Text>
          <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
            {getValue(coupon, "LENGTH")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 18 }}>
          <View style={{ width: 145, flexDirection: "row", gap: 8 }}>
            <Text
              style={{
                width: labelWidth,
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              SPLICE
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
              {getValue(coupon, "SPLICE")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text
              style={{
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              WEIGHT :-
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
              {getValue(coupon, "WEIGHT")}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 18 }}>
          <View style={{ width: 145, flexDirection: "row", gap: 8 }}>
            <Text
              style={{
                width: labelWidth,
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              SLIT ID
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
              {getValue(coupon, "SLIT ID")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text
              style={{
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: textSize,
              }}
            >
              SLIT BY :-
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: textSize }}>
              {getValue(coupon, "SLIT BY")}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: "auto", width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                width: labelWidth,
                fontFamily: "Helvetica",
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              ROLL ID
            </Text>
            <View style={{ flex: 1, alignItems: "center", gap: 1 }}>
              {!!barcode && (
                <Image
                  src={barcode}
                  style={{ width: "50%", height: 20, objectFit: "fill" }}
                />
              )}
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 8 }}>
                {getValue(coupon, "ROLL ID")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          width: 188.84,
          height: "100%",
          display: "flex",
          // backgroundColor: "red",
          flexDirection: "column",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: 250,
            height: 188.84,
            transform: "rotate(-90deg)",
          }}
        >
          <View style={{ flex: topHeadingRowFlex, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 6,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRightWidth: 1.5,
                borderTopWidth: 1.5,
                borderBottomWidth: 1.5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 9, textAlign: "left" }}>
                {`${field0.label}: ${value0}`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 6,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderTopWidth: 1.5,
                borderBottomWidth: 1.5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 9, textAlign: "left" }}>
                {`${field1.label}: ${value1}`}
              </Text>
            </View>
          </View>

          <View style={{ flex: barcodeRowFlex, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRightWidth: 1.5,
                borderBottomWidth: 1.5,
              }}
            >
              {!!barcode0 && (
                <Image
                  src={barcode0}
                  style={{
                    height: 33.96,
                    objectFit: "contain",
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderBottomWidth: 1.5,
              }}
            >
              {!!barcode1 && (
                <Image
                  src={barcode1}
                  style={{
                    height: 33.96,
                    objectFit: "contain",
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
          </View>

          <View style={{ flex: headingRowFlex, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 6,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRightWidth: 1.5,
                borderBottomWidth: 1.5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 9, textAlign: "left" }}>
                {`${field2.label}: ${value2}`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 6,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderBottomWidth: 1.5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 9, textAlign: "left" }}>
                {`${field3.label}: ${value3}`}
              </Text>
            </View>
          </View>

          <View style={{ flex: barcodeRowFlex, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRightWidth: 1.5,
                borderBottomWidth: 1.5,
              }}
            >
              {!!barcode2 && (
                <Image
                  src={barcode2}
                  style={{
                    height: 33.96,
                    objectFit: "contain",
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderBottomWidth: 1.5,
              }}
            >
              {!!barcode3 && (
                <Image
                  src={barcode3}
                  style={{
                    height: 33.96,
                    objectFit: "contain",
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
          </View>

          <View style={{ flex: headingRowFlex, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 6,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRightWidth: 1.5,
                borderBottomWidth: 1.5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 9, textAlign: "left" }}>
                {`${field4.label}: ${value4}`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 6,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderBottomWidth: 1.5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica", fontWeight: 600, fontSize: 9, textAlign: "left" }}>
                {`${field5.label}: ${value5}`}
              </Text>
            </View>
          </View>

          <View style={{ flex: barcodeRowFlex, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRightWidth: 1.5,
              }}
            >
              {!!barcode4 && (
                <Image
                  src={barcode4}
                  style={{
                    height: 33.96,
                    objectFit: "contain",
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {!!barcode5 && (
                <Image
                  src={barcode5}
                  style={{
                    height: 33.96,
                    objectFit: "contain",
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TokenTemplate;
