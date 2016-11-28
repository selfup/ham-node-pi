const app = {}

app.payload = {
  17: false, 27: false, 22: false, 23: false,
  24: false, 25: false, 5: false, 6: false,
}

app.appSlices = {}

app.validAtennas = {
  ANT2: true,
}

app.antennaPayloadKey = {
  ANT2: 17,
}

module.exports = app
//
// @run_slices = -> do
//   if @app_slices.length > 0
//     @app_slices.each do |slice_number, slice_info|
//       if slice_info["tx"] == "1"
//         @slice_to_channel.(slice_info)
//       end
//     end
//   end
// end
//
// @slice_to_channel = -> slice do
//   slice_antenna = slice["txant"]
//   freq = slice["RF_frequency"].to_f
//   ant_to_gpio = @antenna_payload_key[slice_antenna]
//   @payload[ant_to_gpio] = false if @valid_atennas[slice_antenna] && freq >= 3.5
//   @payload[ant_to_gpio] = true if @valid_atennas[slice_antenna] && freq < 3.5
// end