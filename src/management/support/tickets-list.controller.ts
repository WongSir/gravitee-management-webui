/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import TicketService, {TicketsQuery} from '../../services/ticket.service';
import {StateService} from '@uirouter/core';
import {IScope} from 'angular';

class TicketsListController {

  private query: TicketsQuery;
  private tickets: {totalElements: number, content: any[]};

  constructor(
    private TicketService: TicketService,
    private $scope: IScope,
    private $state: StateService) {
    'ngInject';
  }

  $onInit() {

    this.onPaginate = this.onPaginate.bind(this);

    this.query = new TicketsQuery();
    this.query.page = this.$state.params.page || 1;
    this.query.size = this.$state.params.size || 15;
    this.query.field = this.$state.params.field || '-created_at';
    this.query.order = false;

    this.$scope.$watch('ticketsListCtrl.query.field', (field) => {
      if (field) {
        this.refresh();
      }
    });
  }

  onPaginate(page, size) {
    this.query.page = page;
    this.query.size = size;
    this.refresh();
  }

  refresh() {
    this.$state.transitionTo(
      this.$state.current,
      {
        page: this.query.page,
        size: this.query.size,
        field: this.query.field,
        order: this.query.order,
      },
      {notify: false});
    this.TicketService.search(this.query).then((tickets) => {
      this.tickets = tickets.data;
    });
  }
}

export default TicketsListController;
