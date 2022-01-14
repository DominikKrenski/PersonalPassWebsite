SET search_path=development;
TRUNCATE TABLE accounts CASCADE;
INSERT INTO accounts(public_id, email, password, salt, reminder)
VALUES
(
  '771aa756-f064-41d0-9937-62468c7784c2',
  'dominik.krenski@gmail.com',
  '$2a$12$LmRFWqwgwhmaU6LBkvFccOuMsWVYN4g1fDRopIrzDthLYQrqaLrAa',
  '8697a6a9de31af4dd4fff315ead81712',
  'Taka sobie prosta, nic nie wnosząca wiadomość'
),
(
  'f378a1cc-0360-4f01-886b-e568861ff7f3',
  'dorciad@interia.pl',
  '$2a$12$X9QYA8LpKcE42dLku/hzIeCf0Od.E2DcnNU9nZ81kjHEpmpm5Ti0i',
  'c642ee2f068d83e2e2607010a677543e',
  null
);

TRUNCATE TABLE data;
INSERT INTO data(public_id, entry, type, account_id)
VALUES
(
  '9a998cd6-71b1-442b-b663-16aad7b499f3',
  'f2353afe050022decfce3a56.f25f49bfee10105fb7225d91fa85e85984ee0d0ae174d06840f7330303dafc02f1ff8ef8b01900bc0d5dccafb5bd64b82cd721ec372ea8c537b6c8480aa0c9c1fe6515b2485445dda1f929dbb7e380c108383685accf6ac3ebd7fee7e75d94ac1317edb4c082a43ca92f3d7698651f8a1f816b4ee81480aec3bffca50f4b6790587f9203fe07965fca398ceb6d3fad24ba1537367ad9838522002576feb9bebf859c0fc8d34912d59f5af48e8a7b8d194907f629c795c97b81ed11fb59a9a274395bf6b443fd774026f86a06ac9398e5c40b025e5067ec105517f3f8d40b5af3c6c5573bb20107dc0c72cb1c5bbd71f1bdb8381bf36913a33debc530b0a8d44094a7c1045c3fed23786ad7d01090e1669e4f1b198807f12fba0677e71a09933ed5bb3bb89b9754b961e5945fb6feffcca520b5248f265ca2e6d573a2e1ca6661c56c',
  'ADDRESS',
  (SELECT id from accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  'd6656d2c-a6e2-4a1a-a3aa-82a964e6b37f',
  '814820274eabf7393db31db6.01cf3670cb32649e9d18c8ecd25040f3881a04012c82eae127659c076a061ee300092246ba84535c084615d7589734bf56c1203b3250e6a8c6248bb9eec956e31508b18d158c97c69141580a2be071a5f1cf2f59300ea0aefb54e988ca9e781d146146a7dc3d214026f7779da9b5505e78c6c44f043189e396be2fef55e9d7cb30eebe75b876d0cefaefd021b4c4d3596df15d7e6b378b2f6b915c7ce87722e9c3a5e713b6641047c5a14c23bac2d31756db756c65d48e2fdaced91b48caaab9297907b93af524c56892948c7dbc3836af990f7d3e839c328a3fa5ca19687166784e35b62931a890938739ba0c008b20fd6906b2a5f316ea369573327c79',
  'ADDRESS',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  '2a1b10ca-1e6c-457d-b8a7-4f4860ec1cc8',
  'c93e23e142e6d810acc2e09a.1beec990f12c86e19328e8629aea876da13b7b079672d3505b9ba9f9c72ca6ebf288bc42da5304e97b2f1d200f05f217ea096074f176e85612ff9afd202cde312c3a08440d44f65e53502e2c8262add2478101061ad9ac5c6a458e5cf482f15ceb1fcfedaba8a4b095bbefe61cd28be2b10db8b4833bb1f1296ca5043e5eef310806d484ef2f144dc6d9044e1c47f269cd7e452ac053da7397518ddde50c1df89dad961317c44bf66bc772e79b5e5dae41a1ad499c36e798c3c80626ed5a999fae190c2ba3d846244c48c3b4c8c4f3e179401ac83ed505633b26919de13bdf6bd6223d1ac8f4e3e4e7ec5e3779ca8f8a2774014b1951c5184c1c88aa56b693650cbb44355aab0a8bfb',
  'ADDRESS',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  '2d98f03e-17bd-4ab8-bab6-9486b8ca4eac',
  '743ea06ad4cca94989f68c2e.c134a0c0beaf29efe1c6e7e6e2998146f815bfb0987d8d88357ee50f75b8501657f2924763adfe5932d9265650cb9e68856303c43d76c623a84baa1800e8c69bada413f9ff93714d457f1ffe6a5665',
  'NOTE',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  'f7defc99-fa98-4551-9c8f-ec9812f38428',
  '9dbfbda20a73195943d6a9fe.819587522a6a69e0499157b2d739c9f1d7bdd3926b17312124774fe49e370a6a298131b32054a5cf7be0fa2fe6507b5a27a8883d657d9ac543aacb97b2abb963164ab2214a7dc10774761e284bfbcaff5637e49375a947b1a22aa871af107c7e80968f5c03a9cf1ee832077db946565a2c17a7f3ea1a04418d38ae95e58ef035bb068f885c43d487b7def402ffca2edc0b6a991ed84a67ef8e181233a680d5e00cf888a33a490936953b17abc1e1368569b216fb1736fcfc4b732c45f983fe7cd841953a97a2ed4a99392e3d057a3bf9c67eab956a20bc0841c851833ae79e13c82a9c1265e4db145e2a5f8d1bfed775f0e821858bff07cb94305e75a71c37667da38e0f532a6e258b659db305a6ecd14070387d7156f06393a29cfab39801d9547003db70d9efe38e39a84501124b41401606f1a0017fdae0ce3b01c50ca56f1741a219a4d5906105f5e06c0bb14212a1ec60b2b56b04f0f41ba7b337026e00ca99225284979e3b2b78b1bd2b6cd67cf91f5bcc747eabb332e643c86d9f5057c0312367b74b36079178b3364c63592caf5df6071f60134cb0a03326fb6d98a99f0fa7a44f223bc24e72e205f743239cccb8be1750bd03579eb23ba5bfbe2104a068b805d71d37075c0ee11202c3d6754dd1e39fa5c7445c5964cfaa2a56175daa3bf1355531b33efd4c7244aff42e2abcebfee8b6d2742a5c9368c640b382d03c213d397bcd8f75396d8cfadacccbdf90f10466e85b46532bf7ee625b52d9d2272c046b09e418d9d6845de120',
  'NOTE',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  'cf176802-ee64-4af9-a7a1-4189d0a31574',
  '66a5dfa971a9475c6d42ed43.fc6bd0626dd0f212eb122125700ae28fb33c0168c28ccb0752edb7bdfa66501e2504dc63f00ef129e7eb69ee544019e18b1dc439dd067a67791a6e6063698edfc04a8d7e2f13309a7b591fbb252edde46b58',
  'SITE',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  '1274bba6-cba9-4ce2-9461-e1b3b7e00cef',
  '88ab7ce2341343b295a4448e.b5a336c84a4e3a0f634f983442a4ec477bcaa8408e1d148e0b196133ae0752c7bd9523838453286c3571e0620d10347c70a12a797f1c7ab2a28a41493cb1b49c3942ec2caf173f',
  'SITE',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  'd0471244-2795-4e74-8ab8-8850f38e0935',
  '4760efa51b16a7a671cf2702.46dbb411d8b843f03b93d422a668ec856114b72d9ddf405759d2a8c7480576923cb2c24817d0350c9d5d42c29b20826f75588bfe6baa1dff91b0de0f0867a3cc22bb529817240adcae980c35b782d13bb89f3e5cd4e01a75a91b9d9e730e736df3c6261330f101aab295d96f29b3097421c896bc7d1044e32546eaee5da45bb422f55a36d7fcd13cb968122ec0c57033c5efe5dcebd5136c3885ede131570d',
  'PASSWORD',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
),
(
  'd1cae1f9-90c3-4d88-900a-3d0361b763e4',
  '2180cbac008a9cabddcf9cd6.ec97815493340c0880ba3ba5dd6108d0653ba15c8e3f1c86227bc49e62d5308bf02836b052c0537445dfb5433dbe602f977f3e9a42173ec1c4b766fc93aa6dba13ab631e7c32286c50b4918b17460c30b6a1a1577f5bb9ea61d4f23af5d682103dd5ec73c10da3b53ed46249c84fa6',
  'PASSWORD',
  (SELECT id FROM accounts WHERE email = 'dominik.krenski@gmail.com')
);

-- dominik.krenski@gmail.com  Dominik1984! 27c7c87e93a55154137d075ec02612289b9653e894dba3fbbbe88db43f5d9d82
-- dorciad@interia.pl Guziki1302@! 83d7044193762ce7be7dba14226f239f810fc41847bc8db7a4ac0c646817b709