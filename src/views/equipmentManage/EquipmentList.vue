<template>
  <div class="guidance-remote--warpper">
    <view-title title="设备管理"/>
    <search>
      <el-form :inline="true">
        <el-form-item label="KKS">
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input size="mini" v-model="condition.equipment_name" clearable placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="片区">
          <QcCascder v-model="cascaderValue" @changeCode="changeCodeFilter"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="condition.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
          <el-button size="mini" type="primary" @click="addClick">添加</el-button>
        </el-form-item>
      </el-form>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :loading="tableLoading"
        :total="total"
        :page-index="condition.pageIndex"
        @edit="edit"
        @disable="disable"
        @enable="enable"
        @changePage="changePage"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="基本信息"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="customer_name" label="客户名称" :label-width="formLabelWidth">
          <el-input size="mini" placeholder="请输入客户名称" v-model="ruleForm.customer_name"></el-input>
        </el-form-item>
        <el-form-item prop="equipment_type_id" label="设备类型" :label-width="formLabelWidth">
          <el-select
            size="mini"
            v-model="ruleForm.equipment_type_id"
            @change="changeEquipmentId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父KKS" prop="parent_kks" :label-width="formLabelWidth">
          <el-autocomplete
            class="inline-input"
            size="mini"
            v-model="ruleForm.parent_kks"
            :fetch-suggestions="querySearch"
            placeholder="请输入KKS码"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="kks" label="KKS" :label-width="formLabelWidth">
          <el-input
            size="mini"
            placeholder="请输入KKS码后，会进行校验唯一性"
            v-model="ruleForm.kks"
            @change="changekks"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.kks" label="KKS二维码" :label-width="formLabelWidth">
          <canvas id="canvas"></canvas>
          <span @click="downloadQRcode">
            <i
              style="vertical-align:top;font-size:16px;cursor:pointer;margin-top:10px"
              class="el-icon-download"
            ></i>
            <span style="vertical-align:top;cursor:pointer;margin-top:10px">下载二维码</span>
          </span>
        </el-form-item>
        <el-form-item prop="equipment_name" label="名称" :label-width="formLabelWidth">
          <el-input size="mini" placeholder="请输入名称，默认同步KKS码" v-model="ruleForm.equipment_name"></el-input>
        </el-form-item>
        <el-form-item prop="product_code" label="产品编号" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.product_code" placeholder="请输入产品编号"></el-input>
        </el-form-item>
        <el-form-item prop="model_code" label="型号" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.model_code" placeholder="请输入型号"></el-input>
        </el-form-item>
        <el-form-item prop="map_code" label="产品图号" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.map_code" placeholder="请输入产品图号"></el-input>
        </el-form-item>
        <el-form-item prop="assembly_code" label="总成号" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.assembly_code" placeholder="请输入总成号"></el-input>
        </el-form-item>
        <el-form-item prop="patrol_point_id" label="巡检点" :label-width="formLabelWidth">
          <el-autocomplete
            class="inline-input"
            size="mini"
            v-model="ruleForm.patrol_point_id"
            :fetch-suggestions="querySearchPoint"
            placeholder="请输入巡检码"
            @select="handleSelectPoint"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="longitude" label="经度" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item prop="latitude" label="纬度" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>

        <!-- <el-form-item prop="latitude" label="主动巡检设置" :label-width="formLabelWidth">
          <el-checkbox v-model="ruleForm.initiative"></el-checkbox>
          <br>
          <div
            v-if="ruleForm.initiative"
            v-for="(item, index) in ruleForm.equipment_sensor"
            :key="index"
            class="edit-check--box"
          >
            <div class="edit-check--left">
              <el-input size="mini" readonly :value="item.name" placeholder="巡检项" width="80"></el-input>
            </div>
            <div class="edit-check--middle">
              <el-form-item prop="sensor_id">
                <el-select size="mini" v-model="item.sensor_type" placeholder="请选择">
                  <el-option
                    v-for="item in optionSensorTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="edit-check--right">
              <el-form-item prop="sensor_id">
                <el-input size="mini" v-model="item.sensor_id" placeholder="传感器ID" width="80"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>-->
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select size="mini" v-model="ruleForm.status" placeholder="请选择">
            <el-option
              v-for="item in optionsStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" placeholder="请输入备注" size="mini" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit" @click="copy()">复 制</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ViewTitle from "@/components/ViewTitle.vue";
import Search from "@/components/Search.vue";
import PcTable from "@/components/Table.vue";
import QcCascder from "@/components/QcCascder.vue";
import QRCode from "qrcode";

import {
  optionsStatus,
  rules,
  condition,
  columnData,
  options
} from "./equipmentListStatic.js";
export default {
  name: "EquipmentList",
  components: {
    ViewTitle,
    Search,
    PcTable,
    QcCascder
  },
  data() {
    return {
      cascaderArrayStaitc: ["area", "group", "factory", "branch_factory"],
      cascaderValue: [],
      total: 0,
      loading: false,
      tableLoading: false,
      restaurants: [],
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      optionsStatus,
      rules,
      condition: {
        pageIndex: 1,
        pageSize: 10,
        kks: "",
        equipment_name: "",
        status: ""
      },
      patrol_point_id: "",
      ruleForm: {
        customer_name: "",
        id: 0,
        equipment_type_id: "",
        parent_kks: "",
        kks: "",
        equipment_name: "",
        patrol_point_id: "",
        longitude: "",
        latitude: "",
        status: "",
        remark: "",
        initiative: false,
        assembly_code: "",
        map_code: "",
        model_code: "",
        product_code: "",
        equipment_sensor: []
      },
      columnData,
      options,
      type: [],
      restaurantsPatrolPoint: [],
      restaurantsKKS: [],
      isEdit: false,
      optionSensorTypeList: []
    };
  },
  created() {
    this.getEquimentList();
    this.getSensorTypeList();
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {
          customer_name: "",
          id: 0,
          equipment_type_id: "",
          parent_kks: "",
          kks: "",
          equipment_name: "",
          patrol_point_id: "",
          longitude: "",
          latitude: "",
          status: "",
          remark: "",
          assembly_code: "",
          map_code: "",
          model_code: "",
          product_code: "",
          initiative: false,
          equipment_sensor: []
        };
        this.isEdit = false;
      } else {
        this.equipmentType();
        this.getAllKKS();
      }
    }
  },
  methods: {
    downloadQRcode() {
      const url = document.querySelector("#canvas").toDataURL("image/png");
      var oA = document.createElement("a");
      oA.download = ""; // 设置下载的文件名，默认是'下载'
      oA.href = url;
      document.body.appendChild(oA);
      oA.click();
      oA.remove();
    },
    qrcode(content) {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, content, function(error) {
        if (error) console.error(error);
        console.log("success!");
      });
    },
    changeCodeFilter(data) {
      const list = [...this.cascaderArrayStaitc];
      this.cascaderArrayStaitc.forEach(key => {
        delete this.condition[key];
      });
      list.length = this.cascaderValue.length;
      list.forEach((key, index) => {
        this.condition[key] = data[index];
      });
    },
    changeEquipmentId(id) {
      this.$axios
        .get(
          `${this.api}/equipment/getEquipmentSensor?equipment_type_id=${
            this.ruleForm.equipment_type_id
          }`
        )
        .then(res => {
          if (res.data.retCode) {
            console.log(11111111111);
            this.ruleForm.equipment_sensor = res.data.data;
            console.log(this.ruleForm.equipment_sensor);
          }
        });
    },

    getSensorTypeList() {
      this.$axios.get(`${this.upload}/common/getSensorTypeList`).then(res => {
        if (res.data.retCode === 10000) {
          this.optionSensorTypeList = res.data.data;
        }
      });
    },
    copy() {
      this.$confirm("确认要复制吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ruleForm.id = 0;
          this.ruleForm.kks = "";
          this.ruleForm.equipment_name = "";
          this.changeEquipmentId();
          this.$message({
            type: "success",
            message: "复制成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getAllKKS() {
      this.$axios
        .get(`${this.api}/equipment/getAllKKS`)
        .then(res => {
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            this.restaurantsKKS = res.data.data.map(item => ({
              id: item,
              value: item
            }));
          }
        })
        .catch(err => {});
    },
    patrolPoint(resolve) {
      this.$axios
        .get(`${this.api}/patrolPoint/getAll`)
        .then(res => {
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            this.restaurantsPatrolPoint = res.data.data.map(item => ({
              id: item.value,
              value: item.label
            }));
            resolve && resolve();
          }
        })
        .catch(err => {});
    },
    changekks() {
      this.$axios
        .get(
          `${this.api}/equipment/checkKKS?id=${
            this.ruleForm.id
          }&kks=${encodeURIComponent(this.ruleForm.kks)}`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            if (!res.data.data) {
              this.$message({
                message: "kks码可用",
                type: "success"
              });
              this.ruleForm.equipment_name = this.ruleForm.kks;
              this.qrcode(this.ruleForm.kks);
            } else {
              this.$message({
                message: "kks码重复",
                type: "warning"
              });
            }
          }
        });
    },
    equipmentType() {
      this.$axios.get(`${this.api}/equipmentType/getAll`).then(res => {
        const { data } = res.data;
        this.type = data;
      });
    },
    changePage(page) {
      this.condition.pageIndex = page;
      this.getEquimentList();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          // const rules = this.ruleForm.equipment_sensor.some(item => {
          //   console.log(item.sensor_id);
          //   return item.sensor_id == "";
          // });
          // if (rules) {
          //   this.$message({
          //     type: "warnning",
          //     message: "主动巡检每一项请填写清楚"
          //   });
          //   return;
          // }
          this.ruleForm.patrol_point_id = this.patrol_point_id;
          this.$axios
            .post(`${this.api}/equipment/put`, this.ruleForm)
            .then(res => {
              if (res.data.retCode == 10000) {
                this.dialogFormVisible = false;
                this.getEquimentList();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    filter() {
      this.loading = true;
      this.condition.pageIndex = 1;
      this.getEquimentList(true);
    },
    getEquimentList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/equipment/getList`, this.condition)
        .then(res => {
          this.loading = false;
          this.tableLoading = false;
          if (res.data.retCode == 10000) {
            const data = res.data.data.items;
            this.total = res.data.data.total;
            data.forEach((item, index) => {
              item.index = index + 1 + (this.condition.pageIndex - 1) * 10;
              item.statusCode = item.status;
              item.running_name = item.running ? "运行" : "停运";
              item.status = item.status == 1 ? "启用" : "禁用";
              if (item.statusCode == 1) {
                item.buttonInfo = [
                  {
                    name: "edit",
                    type: "primary",
                    label: "编辑"
                  },
                  {
                    name: "disable",
                    type: "danger",
                    label: "禁用"
                  }
                ];
              } else {
                item.buttonInfo = [
                  {
                    name: "edit",
                    type: "primary",
                    label: "编辑"
                  },
                  {
                    name: "enable",
                    type: "primary",
                    label: "启用"
                  }
                ];
              }
            });
            this.tableData = data;
            filter &&
              this.$message({
                message: "搜索成功",
                type: "success"
              });
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableLoading = false;
        });
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurantsKKS;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchPoint(queryString, cb) {
      var restaurants = this.restaurantsPatrolPoint;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelectPoint(item) {
      this.patrol_point_id = item.id;
      this.$axios.get(`${this.api}/patrolPoint/get?id=${item.id}`).then(res => {
        if (res.data.retCode === 10000) {
          const { data } = res.data;
          this.ruleForm.longitude = data.longitude;
          this.ruleForm.latitude = data.latitude;
        }
      });
    },
    addClick() {
      this.patrolPoint();
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.isEdit = true;
      new Promise((resolve, reject) => {
        this.patrolPoint(resolve);
      }).then(() => {
        this.$axios.get(`${this.api}/equipment/get?id=${row.id}`).then(res => {
          const { data } = res.data;
          this.restaurantsPatrolPoint.forEach(item => {
            if (item.id == data.patrol_point_id) {
              data.patrol_point_id = item.value;
            }
          });
          data.equipment_sensor.forEach(item => {
            Object.keys(item).forEach(key => {
              if (item[key] == null) {
                item[key] = "";
              }
            });
          });
          this.equipment_sensor = data.equipment_sensor;
          Object.assign(this.ruleForm, data);
          this.$nextTick(() => {
            this.qrcode(this.ruleForm.kks);
          });
        });
      });
    },
    enable(row) {
      this.$axios
        .get(
          `${this.api}/equipment/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            row.buttonInfo.splice(1, 1, {
              label: "禁用",
              name: "disable",
              type: "danger"
            });
          }
        });
    },
    disable(row) {
      this.$axios
        .get(
          `${this.api}/equipment/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            row.buttonInfo.splice(1, 1, {
              label: "启用",
              name: "enable",
              type: "primary"
            });
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        });
    }
  }
};
</script>
<style lang="less">
.edit-check--box {
  display: flex;
  .el-input {
    width: 90%;
  }
  .edit-check--left {
    flex: 1;
  }
  .edit-check--middle {
    flex: 1;
  }
  .edit-check--right {
    flex: 1;
  }
}
</style>

